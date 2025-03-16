import './header-nav.js';
import './tabs-notes-archieve.js';
import './note-item.js';
import './notes-list.js';
import './add-button.js';
import './add-note-modal.js';
import './note-detail.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabNotes = document.querySelector('#tab-notes')
  const tabArchieve = document.querySelector('#tab-archieve')

  tabNotes.addEventListener('click', () => {
    const active = tabNotes.classList.contains('active')

    if (active) return

    tabNotes.classList.add('border', 'border-white')
    tabNotes.classList.remove('border-[#35383c]', 'bg-[#202224]', 'border-white')
    tabArchieve.classList.add('border', 'border-[#35383c]', 'bg-[#202224]')

    tabNotes.classList.add('active')
    tabArchieve.classList.remove('active')
  })

  tabArchieve.addEventListener('click', () => {
    const active = tabArchieve.classList.contains('active')

    if (active) return

    tabArchieve.classList.add('border', 'border-white')
    tabArchieve.classList.remove('border-[#35383c]', 'bg-[#202224]', 'border-white')
    tabNotes.classList.add('border', 'border-[#35383c]', 'bg-[#202224]')

    tabArchieve.classList.add('active')
    tabNotes.classList.remove('active')
  })
})