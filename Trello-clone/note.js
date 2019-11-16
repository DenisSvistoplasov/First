class Note {
    constructor(id = undefined, content = ''){
        const instance = this;
        const element = this.element = document.createElement('div');
        element.classList.add('note')
        element.setAttribute('draggable', 'true');

        if (id) element.setAttribute('data-note-id', id);
        else element.setAttribute('data-note-id', Note.idCounter++);

        element.textContent = content;
        element.setAttribute('contenteditable', 'true');
        
        element.addEventListener('dblclick', function (event) {
            element.setAttribute('contenteditable', 'true')
            element.removeAttribute('draggable')
            instance.column.removeAttribute('draggable')
            element.focus()
        })
        
        element.addEventListener('blur', function (event) {
            element.removeAttribute('contenteditable')
            element.setAttribute('draggable', 'true')
            instance.column.setAttribute('draggable', 'true');
            element.innerText = element.innerText.trim();
            if (!element.textContent.trim().length) {
                element.remove()
            }
            Application.save();
        })
    
        element.addEventListener('dragstart', this.dragstart.bind(this))
        element.addEventListener('dragend', this.dragend.bind(this))
        element.addEventListener('dragenter', this.dragenter.bind(this))
        element.addEventListener('dragover', this.dragover.bind(this))
        element.addEventListener('dragleave', this.dragleave.bind(this))
        element.addEventListener('drop', this.drop.bind(this))
    }

    get column(){
        return this.element.closest('.column');
    }

    dragstart (event) {
        Note.dragged = this.element
        this.element.classList.add('dragged')
    
        event.stopPropagation()
    }
    
    dragend (event) {
        Note.dragged = null
        this.element.classList.remove('dragged')
    }
    
    dragenter (event) {
        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
        this.element.classList.add('under')
    }
    
    dragover (event) {
        event.preventDefault()
    
        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
    }
    
    dragleave (event) {
        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
        this.element.classList.remove('under')
    }
    
    drop (event) {
        event.stopPropagation() 
        this.element.classList.remove('under')
        if (this.element === Note.dragged) {
            return
        }
        // column dropped on note
        if (Column.dragged){
            // not the same column
            if (this.element.closest('.column') !== Column.dragged) {
                const col = Array.from(document.querySelectorAll('.column'))
                const indexA = col.indexOf(this.element.closest('.column'))
                const indexB = col.indexOf(Column.dragged)
                this.element.closest('.column').classList.remove('under')  
                if (indexA < indexB) {
                    this.element.closest('.column').parentElement.insertBefore(Column.dragged, this.element.closest('.column'))
                }
                else {
                    this.element.closest('.column').parentElement.insertBefore(Column.dragged, this.element.closest('.column').nextElementSibling)
                } 
                Application.save();
                return
            }
            else return
        }
        // note dropped on a note
        // on the same column
        if (this.element.parentElement === Note.dragged.parentElement) {
            const note = Array.from(this.element.parentElement.querySelectorAll('.note'))
            const indexA = note.indexOf(this.element)
            const indexB = note.indexOf(Note.dragged)
            if (indexA < indexB) {
                this.element.parentElement.insertBefore(Note.dragged, this.element)
            }
            else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling)
            }
        }
        // on the other column
        else {
            this.element.parentElement.insertBefore(Note.dragged, this.element)
        }
        Application.save();
    }
}
Note.idCounter = 8;
Note.dragged = null;


