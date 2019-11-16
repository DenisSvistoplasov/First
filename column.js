class Column {
    constructor(id = undefined){
        const instance = this;
        const element = this.element = document.createElement('div')
        element.classList.add('column')
        element.setAttribute('draggable', 'true');
        if (id) element.setAttribute('data-column-id', id);
        else element.setAttribute('data-column-id', Column.idCounter++);

        element.innerHTML = `<p class="column-header"></p><div data-notes></div><p class="column-footer"><span data-action-addNote class="action">+ Добавить карточку</span></p>`;
        
        const spanAction_addNote = element.querySelector('[data-action-addNote]')

		spanAction_addNote.addEventListener('click', function (event) {
			let note = new Note();
            instance.add(note);
            note.element.focus()
		})

		element.addEventListener('dragstart', this.dragstart.bind(this))
        element.addEventListener('dragend', this.dragend.bind(this))
        element.addEventListener('dragenter', this.dragenter.bind(this))
        element.addEventListener('dragover', this.dragover.bind(this))
        element.addEventListener('dragleave', this.dragleave.bind(this))
        element.addEventListener('drop', this.drop.bind(this))
        

        const headerElement = element.querySelector('.column-header')
        headerElement.addEventListener('dblclick', function (event) {
            headerElement.setAttribute('contenteditable', true)
            headerElement.focus()
        });
        headerElement.addEventListener('blur', function (event) {
            headerElement.removeAttribute('contenteditable', true);
            Application.save();
        });

        element.querySelector('.column-header').setAttribute('contenteditable', true);
    }

    add(note){
        this.element.querySelector('[data-notes]').append(note.element);
    }

    dragstart (event) {
        Column.dragged = this.element
        this.element.classList.add('dragged')
        event.stopPropagation()
    }
    
    dragend (event) {
        this.element.classList.remove('dragged')
        Column.dragged = null
    
        // document
        //     .querySelectorAll('.column')
        //     .forEach(x => x.classList.remove('under'))
    }
    
    dragenter (event) {
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
        // this.element.classList.add('under')
    }
    
    dragover (event) {
        event.preventDefault()
    
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
        this.element.classList.add('under')
    }
    
    dragleave (event) {
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
        this.element.classList.remove('under')
    }
    
    drop (event) {
        event.stopPropagation() 
        this.element.classList.remove('under')  

        // note dropped on column
        if (Note.dragged) {
            this.element.querySelector('[data-notes]').append(Note.dragged);
            Application.save();
            return;
        } 

        // column dropped on a column
        // not the same column
        if (this.element !== Column.dragged) {
            const col = Array.from(document.querySelectorAll('.column'))
            const indexA = col.indexOf(this.element)
            const indexB = col.indexOf(Column.dragged)
            
            if (indexA < indexB) {
                this.element.parentElement.insertBefore(Column.dragged, this.element)
            }
            
            else {
                this.element.parentElement.insertBefore(Column.dragged, this.element.nextElementSibling)
            } 
            Application.save();
        }
        else return   
    }
}
Column.idCounter = 4;
Column.dragged = null;

    

