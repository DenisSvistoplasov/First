const Application = {
	save(){
		var object= {
			idCounter: document.querySelectorAll('.column').length,
			columns: []
		}
		// column pass
		document.querySelectorAll('.column').forEach(columnElement => {
			const column = {
				id: +columnElement.getAttribute ('data-column-id'),
				title: columnElement.querySelector('.column-header').innerText,
				notes: []
			}
			// note pass
			columnElement.querySelectorAll('.note').forEach(noteElement => {
				let noteId = +noteElement.getAttribute('data-note-id');
				let noteItem = {
					id: noteId,
					content: noteElement.textContent
				}
				column.notes.push(noteItem);
			});
			object.columns.push(column);
		});
		localStorage.setItem('trello', JSON.stringify(object));
	},

	load(){
		if (!localStorage.getItem('trello')) return;
		const object = JSON.parse(localStorage.getItem('trello'));

		var mountPoint = document.querySelector('.columns');
		mountPoint.innerHTML = '';

		for (const column of object.columns){
			let newColumn = new Column(column.id);
			newColumn.element.querySelector('.column-header').innerText = column.title;
			for (const note of column.notes){
				let newNote = new Note(note.id, note.content);
				newColumn.add(newNote);
			}
			mountPoint.append(newColumn.element);
		}
	}
}
