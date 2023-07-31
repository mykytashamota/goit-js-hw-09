import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

let timerId = null;

const refs = {
  getElInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = Date.now();
    if (selectedDates[0] - currentDate > 0) {
      refs.startBtn.disabled = false;
    } else {
      refs.startBtn.disabled = true;
      Notify.failure('Please choose a date in the future');
    }
  },
};

const fp = flatpickr(refs.getElInput, options);

refs.startBtn.addEventListener('click', onClickStartBtn);

function onClickStartBtn() {
  start();
}

function start() {
  timerId = setInterval(() => {
    const selectDate = fp.selectedDates[0].getTime();
    const dataNew = new Date().getTime();
    const ms = selectDate - dataNew;
    if (ms < 0) {
      clearInterval(timerId);
      return;
    }
    updateTimer(convertMs(ms));
  }, 1000);
  refs.startBtn.disabled = true;
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = `${days}`;
  refs.dataHours.textContent = `${hours}`;
  refs.dataMinutes.textContent = `${minutes}`;
  refs.dataSeconds.textContent = `${seconds}`;
}
function pad(value) {
  return String(value).padStart(2, '0');
}
// -----------------

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
