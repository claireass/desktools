mod commands;

use tauri_plugin_log::{Target, TargetKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
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
        .invoke_handler(tauri::generate_handler![commands::app::get_app_info])
        .setup(|app| {
            log::info!("DeskTools started version {}", app.package_info().version);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
