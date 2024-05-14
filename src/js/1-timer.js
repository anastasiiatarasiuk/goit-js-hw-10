import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');
const dataDays = document.querySelector('[data-days]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const chosenDate = new Date(dateInput.value);
    const timeToFinish = chosenDate - Date.now();
    if (timeToFinish <= 0) {
      clearInterval(timerId);
      totalFormattedTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      startBtn.disabled = false;
      dateInput.disabled = false;
      return;
    }

    const formattedTime = convertMs(timeToFinish);
    totalFormattedTime(formattedTime);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const totalFormattedTime = ({ days, hours, minutes, seconds }) => {
  dataDays.textContent = addLeadingZero(days);
  dataHours.textContent = addLeadingZero(hours);
  dataMinutes.textContent = addLeadingZero(minutes);
  dataSeconds.textContent = addLeadingZero(seconds);
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000));
console.log(convertMs(140000));
console.log(convertMs(24140000));

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = Date.now();

    if (userSelectedDate <= currentDate) {
      startBtn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        color: '#EF4040',
        messageColor: '#fff',
      });
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr('input#datetime-picker', options);
