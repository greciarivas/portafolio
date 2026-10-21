// ============================================================
// CV DIGITAL - INTERACTIVE JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initPhotoUploader();
  initContactForm();
  initTimelineInteractive();
  initDownloadCV();
  initNavbarScroll();
});

/**
 * 1. Photo Uploader with LocalStorage Persistence
 * Permite cambiar la foto del contenedor "*foto mia*" fácilmente
 */
function initPhotoUploader() {
  const photoInput = document.getElementById('photoUploadInput');
  const userPhotoImg = document.getElementById('userPhotoImg');

  // Recuperar imagen guardada si existe
  const savedPhoto = localStorage.getItem('cv_user_photo');
  if (savedPhoto && userPhotoImg) {
    userPhotoImg.src = savedPhoto;
  }

  if (photoInput && userPhotoImg) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Por favor selecciona un archivo de imagen válido.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          const imageBase64 = event.target.result;
          userPhotoImg.src = imageBase64;
          try {
            localStorage.setItem('cv_user_photo', imageBase64);
            showToast('¡Foto actualizada con éxito!');
          } catch (err) {
            console.warn('LocalStorage limit reached or disabled:', err);
            showToast('Foto cargada en vista previa.');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

/**
 * 2. Formulario de Contacto Interactivo con Validación
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const asuntoInput = document.getElementById('asunto');
  const mensajeInput = document.getElementById('mensaje');
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  // Limpiar estados de error al escribir
  [nombreInput, emailInput, asuntoInput, mensajeInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        const wrapper = input.closest('.input-with-icon');
        if (wrapper) wrapper.classList.remove('has-error');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validación Nombre
    if (!nombreInput.value.trim()) {
      markError(nombreInput);
      isValid = false;
    }

    // Validación Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      markError(emailInput);
      isValid = false;
    }

    // Validación Asunto
    if (!asuntoInput.value.trim()) {
      markError(asuntoInput);
      isValid = false;
    }

    // Validación Mensaje
    if (!mensajeInput.value.trim()) {
      markError(mensajeInput);
      isValid = false;
    }

    if (!isValid) {
      showToast('Por favor revisa los campos requeridos en rojo.');
      return;
    }

    // Simulación de envío con feedback interactivo
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-flex';

    setTimeout(() => {
      // Restaurar botón
      submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-flex';
      if (btnSpinner) btnSpinner.style.display = 'none';

      // Mostrar confirmación
      if (successAlert) {
        successAlert.style.display = 'flex';
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 6000);
      }

      showToast('¡Mensaje enviado correctamente! Gracias por contactarme.');
      form.reset();
    }, 1200);
  });

  function markError(inputElement) {
    const wrapper = inputElement.closest('.input-with-icon');
    if (wrapper) {
      wrapper.classList.add('has-error');
      inputElement.focus();
    }
  }
}

/**
 * 3. Timeline Interactivo (resalta el año seleccionado)
 */
function initTimelineInteractive() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  timelineItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      timelineItems.forEach(i => {
        const card = i.querySelector('.timeline-card');
        if (card) card.classList.remove('active');
      });
      const currentCard = item.querySelector('.timeline-card');
      if (currentCard) currentCard.classList.add('active');
    });
  });
}

/**
 * 4. Botón Descargar CV (Imprimir/Guardar como PDF)
 */
function initDownloadCV() {
  const downloadBtn = document.getElementById('downloadCvBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Abriendo ventana para guardar/imprimir CV en PDF...');
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }
}

/**
 * 5. Barra de Navegación con Sombra al Hacer Scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.borderBottomColor = 'rgba(255, 42, 133, 0.35)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255, 105, 180, 0.14)';
      navbar.style.boxShadow = 'none';
    }
  });
}

/**
 * Utilidad Toast Notification
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--accent-pink);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
