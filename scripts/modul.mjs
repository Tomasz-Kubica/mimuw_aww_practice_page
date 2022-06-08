export const komunikat = "Hello World";

const parser = new DOMParser();

function check_input_with_message(element, message, condition) {
  const check = condition(element);
  if (!check) {
    element.classList.add('incorrect_text_input');
    element.nextElementSibling.innerHTML = message;
  } else {
    element.classList.remove('incorrect_text_input');
    element.nextElementSibling.innerHTML = '';
  }
  return check;
}

const checkLength = (element) => element.value.length > 0 && element.value.length < 40;
const checkNotToShort = (element) => element.value.length >= 5;
const checkNotZero = (element) => element.value > 0;

export function check_reservation_input(form) {
  const name = form.querySelector('#name');
  const surname = form.querySelector('#surname');
  const ile_osob = form.querySelector('#ile_osob');
  const correct_name = check_input_with_message(name, 'niepoprawne imię', checkLength);
  const correct_surname = check_input_with_message(surname, 'niepoprawne nazwisko', checkLength);
  const correct_ile_osob = check_input_with_message(ile_osob, 'liczba osób musi być dodatnia', checkNotZero);
  return correct_name && correct_surname && correct_surname && correct_ile_osob;
  // return true;
}

export function check_registration_input(form) {
  const name = form.querySelector('#name');
  const surname = form.querySelector('#surname');
  const password = form.querySelector('#password');
  const password_repeat = form.querySelector('#password_repeat');
  const correct_name = check_input_with_message(name, 'niepoprawne imię', checkLength);
  const correct_surname = check_input_with_message(surname, 'niepoprawne nazwisko', checkLength);
  const correct_password = check_input_with_message(password, 'za krótkie hasło', checkNotToShort);
  const correct_password_repeat = check_input_with_message(
    password_repeat,
    'musi byc takie smao jak oryginalne',
    (element) => element.value === password.value,
  );
  return correct_name && correct_surname && correct_surname && correct_password;
  // return true;
}

function get_popup(message) {
  let popup_html = `<div class="success-popup"><div class="success-popup-content"><p>${
    message
  }</p><button id="close" type="button"> close </button></div></div>`;
  let popup_element = parser.parseFromString(popup_html, 'text/html').body.firstChild;
  let close_function = () => {
    popup_element.remove();
  };
  popup_element.querySelector('#close').addEventListener('click', close_function);
  setTimeout(close_function, 5000);
  return popup_element;
}

export function spawn_popup(message, element) {
  const popup = get_popup(message);
  element.appendChild(popup);
}

export function add_form_check_listener(form, input_checker) {
  function input_check_listener(evt) {
    console.log('submit!!!')
    if (!input_checker(form)) {
      console.log('wrong input');
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      // let name = form.querySelector('#name').value;
      // let surname = form.querySelector('#surname').value;
      // form.after(get_popup(name + " " + surname + " dziękujemy za wypełnienie formularza"));
    }
  }
  form.addEventListener('submit', input_check_listener);
}

function focus_in_listener(evt) {
  evt.target.classList.add('focus_text_input');
}

function focus_out_listener(evt) {
  evt.target.classList.remove("focus_text_input");
}

export function add_focus_listeners(element) {
  element.addEventListener("focusin", focus_in_listener);
  element.addEventListener("focusout", focus_out_listener);
}