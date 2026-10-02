use std::sync::atomic::{AtomicBool, Ordering};

use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, State, Window, WindowEvent};

const TRAY_ID: &str = "desktools";
const WINDOW_LABEL: &str = "main";

pub struct TrayMode {
    pub close_to_tray: AtomicBool,
    pub quitting: AtomicBool,
}

impl Default for TrayMode {
    fn default() -> Self {
        Self {
            close_to_tray: AtomicBool::new(false),
            quitting: AtomicBool::new(false),
        }
    }
}

pub fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window(WINDOW_LABEL) {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

pub fn quit_app(app: &AppHandle) {
    if let Some(state) = app.try_state::<TrayMode>() {
        state.quitting.store(true, Ordering::SeqCst);
        state.close_to_tray.store(false, Ordering::SeqCst);
    }
    let _ = app.remove_tray_by_id(TRAY_ID);
    log::info!("Tray quit");
    app.exit(0);
}

pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    let WindowEvent::CloseRequested { api, .. } = event else {
        return;
    };
    let Some(state) = window.app_handle().try_state::<TrayMode>() else {
        return;
    };
    if state.quitting.load(Ordering::SeqCst) || !state.close_to_tray.load(Ordering::SeqCst) {
        return;
    }
    api.prevent_close();
    let _ = window.hide();
}

pub fn handle_tray_icon_event(app: &AppHandle, event: TrayIconEvent) {
    let show = matches!(
        event,
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } | TrayIconEvent::DoubleClick {
            button: MouseButton::Left,
            ..
        }
    );
    if show {
        show_main_window(app);
    }
}

#[tauri::command]
pub fn set_close_to_tray(
    app: AppHandle,
    state: State<'_, TrayMode>,
    enabled: bool,
    show_label: String,
    quit_label: String,
) -> Result<(), String> {
    state.close_to_tray.store(enabled, Ordering::SeqCst);
    let _ = app.remove_tray_by_id(TRAY_ID);
    if !enabled {
        return Ok(());
    }

    let show = MenuItem::with_id(&app, "show", show_label, true, None::<&str>)
        .map_err(|error| error.to_string())?;
    let quit = MenuItem::with_id(&app, "quit", quit_label, true, None::<&str>)
        .map_err(|error| error.to_string())?;
    let menu = Menu::with_items(&app, &[&show, &quit]).map_err(|error| error.to_string())?;
    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("DeskTools")
        .menu(&menu)
        .show_menu_on_left_click(false);
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    builder.build(&app).map_err(|error| error.to_string())?;
    Ok(())
}
