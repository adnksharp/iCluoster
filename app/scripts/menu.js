exports.createTemplate = (name) => {
	let template = [
		{
			label: 'Ventana',
			role: 'window',
			submenu: [
				{
					label: 'Minimizar',
					role: 'minimize'
				},
				{
					label: 'Maximizar',
					role: 'maximize'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cerrar',
					role: 'close'
				}
			],
		},
		{
			label: 'Accesibilidad',
			role: 'accessibility',
			submenu: [
				{
					label: 'Recargar',
					role: 'reload'
				},
				{
					label: 'Forzar recarga',
					role: 'forcereload'
				},
				{
					type: 'separator'
				},
				{
					label: 'Reiniciar',
					role: 'restart'
				}
			],
		},
	];
	return template;
};

