const form = document.getElementById('lesson-form');
const lessonList = document.getElementById('lesson-list');
const emptyState = document.getElementById('empty-state');
const formMessage = document.getElementById('form-message');

const STORAGE_KEY = 'violinLessonTrackerRecords';

const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
}

function renderRecords() {
  lessonList.innerHTML = '';

  records.forEach((record, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.studentName}</td>
      <td>${formatDate(record.lessonDate)}</td>
      <td>${record.lessonDuration} min</td>
      <td>${record.remainingLessons}</td>
      <td><button type="button" data-index="${index}">Delete</button></td>
    `;

    lessonList.appendChild(row);
  });

  emptyState.hidden = records.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const studentName = String(formData.get('studentName') || '').trim();
  const lessonDate = String(formData.get('lessonDate') || '').trim();
  const lessonDuration = Number(formData.get('lessonDuration'));
  const remainingLessons = Number(formData.get('remainingLessons'));

  if (!studentName || !lessonDate || lessonDuration <= 0 || remainingLessons < 0) {
    formMessage.textContent = 'Please enter valid lesson details.';
    return;
  }

  records.push({
    studentName,
    lessonDate,
    lessonDuration,
    remainingLessons,
  });

  saveRecords();
  renderRecords();
  form.reset();
  formMessage.textContent = 'Lesson added.';
});

lessonList.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement) || target.tagName !== 'BUTTON') {
    return;
  }

  const index = Number(target.dataset.index);

  if (Number.isNaN(index)) {
    return;
  }

  records.splice(index, 1);
  saveRecords();
  renderRecords();
  formMessage.textContent = 'Lesson deleted.';
});

renderRecords();
