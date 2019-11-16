Application.load();


// action of "addColumn" button
document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		const columnElement = new Column().element;
		document.querySelector('.columns').append(columnElement);
        columnElement.querySelector('.column-header').focus()
	});

// bin events
var bin = document.querySelector('.bin');
bin.addEventListener('dragenter', function(e){
	bin.classList.add('under');
});
bin.addEventListener('dragover', function(e){
	e.preventDefault();
});
bin.addEventListener('dragleave', function(e){
	bin.classList.remove('under');
});
bin.addEventListener('drop', function(e){
	e.stopPropagation();
	bin.classList.remove('under');
	if (Note.dragged) Note.dragged.remove();
	if (Column.dragged) Column.dragged.remove();
	Application.save();
});

window.onbeforeunload = function(e){
	document.querySelectorAll('.column, .note').forEach(a => a.blur());
	Application.save();
};
