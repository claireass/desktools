mod commands;

use tauri::Manager;

use tauri_plugin_log::{Target, TargetKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("desktools".into()),
                    }),
                ])
                .build(),
        )
        .on_menu_event(|app, event| {
            if event.id() == "show" {
                commands::tray::show_main_window(app);
            } else if event.id() == "quit" {
                commands::tray::quit_app(app);
            }
        })
        .on_tray_icon_event(commands::tray::handle_tray_icon_event)
        .on_window_event(commands::tray::handle_window_event)
        .invoke_handler(tauri::generate_handler![
            commands::app::get_app_info,
            commands::tray::set_close_to_tray
        ])
        .setup(|app| {
            app.manage(commands::tray::TrayMode::default());
            log::info!("DeskTools started version {}", app.package_info().version);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
