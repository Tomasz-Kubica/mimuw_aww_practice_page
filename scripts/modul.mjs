export const komunikat = "Hello World";

const parser = new DOMParser();

function check_text_input_length(element, message, condition) {
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

function check_input(form) {
  const checkLength = (element) => element.value.length > 0 && element.value.length < 40;
  const checkNotZero = (element) => element.value > 0;
  const name = form.querySelector('#name');
  const surname = form.querySelector('#surname');
  const ile_osob = form.querySelector('#ile_osob');
  const correct_name = check_text_input_length(name, 'niepoprawne imię', checkLength);
  const correct_surname = check_text_input_length(surname, 'niepoprawne nazwisko', checkLength);
  const correct_ile_osob = check_text_input_length(ile_osob, 'liczba osób musi być dodatnia', checkNotZero);
  // return correct_name && correct_surname && correct_surname && correct_ile_osob;
  return true;
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

export function add_form_check_listener(form) {
  function input_check_listener(evt) {
    console.log('submit!!!')
    if (!check_input(form)) {
      console.log('wrong input');
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      let name = form.querySelector('#name').value;
      let surname = form.querySelector('#surname').value;
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