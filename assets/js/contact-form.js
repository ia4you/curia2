// <contact-form>: formulario de contacto SOLO VISUAL (versión de demostración).
// Todo el formulario (marcado, validación y estados) vive en este archivo.
// No hace ninguna petición de red: al enviar solo muestra el aviso de demostración.

const PHONE = "928 248 581";
const PHONE_HREF = "tel:+34928248581";
const EMAIL = "info@curiaabogados.es";

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", autocomplete: "given-name", required: true, missing: "Escribe tu nombre." },
  { name: "apellidos", label: "Apellidos", type: "text", autocomplete: "family-name", required: false },
  {
    name: "correo",
    label: "Correo",
    type: "email",
    autocomplete: "email",
    required: true,
    full: true,
    missing: "Escribe tu correo electrónico.",
    mismatch: "Escribe un correo válido, por ejemplo nombre@dominio.es.",
  },
  {
    name: "telefono",
    label: "Teléfono",
    type: "tel",
    autocomplete: "tel",
    required: false,
    pattern: "\\+?[0-9][0-9\\s\\(\\)\\.\\-]{7,}",
    mismatch: "Escribe un teléfono válido, por ejemplo 928 248 581.",
  },
  { name: "asunto", label: "Asunto", type: "text", autocomplete: "off", required: false },
  {
    name: "mensaje",
    label: "Mensaje",
    type: "textarea",
    required: true,
    full: true,
    minlength: 10,
    missing: "Cuéntanos brevemente tu consulta.",
    short: "El mensaje es muy corto: escribe al menos 10 caracteres.",
  },
];

const CONSENT_MISSING = "Necesitamos que aceptes la política de privacidad para poder atenderte.";

const icon = (name, cls) =>
  `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;

function fieldHtml(f) {
  const id = `cf-${f.name}`;
  const attrs = [
    `id="${id}"`,
    `name="${f.name}"`,
    f.required ? "required" : "",
    f.autocomplete ? `autocomplete="${f.autocomplete}"` : "",
    f.pattern ? `pattern="${f.pattern}"` : "",
    f.minlength ? `minlength="${f.minlength}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const control =
    f.type === "textarea"
      ? `<textarea ${attrs} rows="6"></textarea>`
      : `<input type="${f.type}" ${attrs}${f.type === "email" ? ' inputmode="email"' : ""}${f.type === "tel" ? ' inputmode="tel"' : ""}>`;
  return `
    <div class="field${f.full ? " full" : ""}" data-field="${f.name}">
      <label for="${id}">${f.label}${f.required ? "" : ' <span class="opt">(opcional)</span>'}</label>
      <div class="control">
        ${control}
        ${icon("check-circle", "state-icon state-ok")}${icon("warning-circle", "state-icon state-err")}
      </div>
      <p class="error" id="${id}-error">${icon("warning-circle", "")}<span></span></p>
    </div>`;
}

class ContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form class="form-panel" novalidate aria-label="Formulario de contacto">
        <div class="form-grid">
          ${FIELDS.map(fieldHtml).join("")}
          <div class="field full" data-field="consentimiento">
            <div class="consent">
              <input type="checkbox" id="cf-consentimiento" name="consentimiento" required>
              <label for="cf-consentimiento">He leído y acepto la <a href="/politica-de-privacidad/">Política de privacidad</a>.</label>
            </div>
            <p class="error" id="cf-consentimiento-error">${icon("warning-circle", "")}<span></span></p>
          </div>
        </div>
        <div class="form-actions"><button class="btn" type="submit">Enviar mensaje</button></div>
        <div class="notice" role="status" tabindex="-1" hidden>
          <strong>Versión de demostración:</strong> este formulario aún no envía mensajes.
          Llámanos al <a href="${PHONE_HREF}">${PHONE}</a> o escribe a <a href="mailto:${EMAIL}">${EMAIL}</a>
        </div>
      </form>`;

    this.form = this.querySelector("form");
    this.notice = this.querySelector(".notice");
    this.touched = new Set();

    // Se valida al salir de un campo; después, mientras se escribe.
    this.form.addEventListener("focusout", (event) => {
      const el = event.target.closest("input, textarea");
      if (!el) return;
      this.touched.add(el.name);
      this.validate(el);
    });
    this.form.addEventListener("input", (event) => {
      const el = event.target.closest("input, textarea");
      if (!el) return;
      this.notice.hidden = true;
      if (this.touched.has(el.name)) this.validate(el);
    });
    this.form.addEventListener("submit", (event) => this.onSubmit(event));
  }

  message(el) {
    const f = FIELDS.find((x) => x.name === el.name);
    const v = el.validity;
    if (el.name === "consentimiento") return CONSENT_MISSING;
    if (v.valueMissing) return f.missing;
    if (v.typeMismatch || v.patternMismatch) return f.mismatch;
    if (v.tooShort) return f.short;
    return "Revisa este campo.";
  }

  validate(el) {
    const wrapper = el.closest(".field");
    const error = wrapper.querySelector(".error");
    const empty = el.type === "checkbox" ? !el.checked : el.value.trim() === "";
    // Un campo opcional vacío no se marca ni como válido ni como erróneo.
    if (!el.required && empty) {
      wrapper.dataset.state = "";
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      return true;
    }
    if (el.validity.valid && !(el.type !== "checkbox" && empty)) {
      wrapper.dataset.state = el.type === "checkbox" ? "" : "valid";
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      return true;
    }
    wrapper.dataset.state = "invalid";
    error.querySelector("span").textContent = this.message(el);
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", error.id);
    return false;
  }

  onSubmit(event) {
    // Sin petición de red: el envío se cancela siempre.
    event.preventDefault();
    const controls = [...this.form.querySelectorAll("input, textarea")];
    controls.forEach((el) => this.touched.add(el.name));
    const invalid = controls.filter((el) => !this.validate(el));
    if (invalid.length) {
      this.notice.hidden = true;
      invalid[0].focus();
      return;
    }
    // TODO: conectar aquí el envío real (endpoint, servicio de formularios o backend)
    // con los datos de new FormData(this.form), y retirar el aviso de demostración.
    this.notice.hidden = false;
    this.notice.focus();
  }
}

customElements.define("contact-form", ContactForm);
