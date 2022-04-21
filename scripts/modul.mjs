export const komunikat = "Hello World";

const parser = new DOMParser();

function check_text_input_length(element, message) {
  let check = element.value.length > 0 && element.value.length < 40;
  if (!check) {
    element.classList.add("incorrect_text_input");
    element.nextElementSibling.innerHTML = message;
  } else {
    element.classList.remove("incorrect_text_input");
    element.nextElementSibling.innerHTML = "";
  }
  return check;
}

function check_input(form) {
  let name = form.querySelector("#name");
  let surname = form.querySelector("#surname");
  let correct_name = check_text_input_length(name, "niepoprawne imię");
  let correct_surname = check_text_input_length(surname, "niepoprawne nazwisko");
  return correct_name && correct_surname;
}

function get_popup(message) {
  let popup_html = '<div class="success-popup"><div class="success-popup-content"><p>' 
  + message 
  + '</p><button id="close" type="button"> close </button></div></div>';
  let popup_element = parser.parseFromString(popup_html, "text/html").body.firstChild;
  let close_function = () => {
    popup_element.remove();
  };
  popup_element.querySelector("#close").addEventListener("click", close_function);
  setTimeout(close_function, 15000);
  return popup_element;
}

export function add_form_check_listener(form) {
  function input_check_listener(evt) {
    console.log("submit!!!")
    evt.preventDefault();
    evt.stopPropagation();
    if (!check_input(form)) {
      console.log("wrong input");
    } else {
      let name = form.querySelector("#name").value;
      let surname = form.querySelector("#surname").value;
      form.after(get_popup(name + " " + surname + " dziękujemy za wypełnienie formularza"));
    }
  }
  form.addEventListener('submit', input_check_listener);
}

function focus_in_listener(evt) {
  evt.target.classList.add("focus_text_input");
}

function focus_out_listener(evt) {
  evt.target.classList.remove("focus_text_input");
}

export function add_focus_listeners(element) {
  element.addEventListener("focusin", focus_in_listener);
  element.addEventListener("focusout", focus_out_listener);
}