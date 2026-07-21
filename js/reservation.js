/**
 * EMMY Restaurant - Reservation Module
 * Handles: Form validation, local storage, confirmation modal
 * Backend-ready: Firebase / EmailJS placeholder functions included
 */

'use strict';

const Reservation = (() => {
  const STORAGE_KEY = 'emmy-reservations';

  /* ---- Storage ---- */
  const getAllReservations = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const saveReservation   = (r) => {
    const all = getAllReservations();
    all.push(r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  };

  /* ---- Validation ---- */
  const rules = {
    'res-name':    { label: 'Full Name',     test: v => v.trim().length >= 2 },
    'res-phone':   { label: 'Phone',         test: v => /^[\d\s+\-()]{7,15}$/.test(v.trim()) },
    'res-email':   { label: 'Email',         test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    'res-date':    { label: 'Date',          test: v => !!v && new Date(v) >= new Date(new Date().toDateString()) },
    'res-time':    { label: 'Time',          test: v => !!v },
    'res-guests':  { label: 'Guest Count',   test: v => parseInt(v) >= 1 && parseInt(v) <= 20 }
  };

  const validateField = (id) => {
    const input = document.getElementById(id);
    if (!input) return true;

    const rule  = rules[id];
    const valid = rule.test(input.value);
    const group = input.closest('.form-group');

    group?.classList.toggle('error', !valid);

    // Set error message
    const errEl = group?.querySelector('.form-error');
    if (errEl && !valid) {
      if (id === 'res-date') {
        errEl.textContent = `Please select a future date.`;
      } else if (id === 'res-email') {
        errEl.textContent = `Please enter a valid email address.`;
      } else {
        errEl.textContent = `${rule.label} is required.`;
      }
    }

    return valid;
  };

  const validateAll = () => {
    const results = Object.keys(rules).map(validateField);
    return results.every(Boolean);
  };

  /* ---- Date Validation ---- */
  const setMinDate = () => {
    const dateInput = document.getElementById('res-date');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  };

  /* ---- Backend Placeholders ---- */
  /**
   * Send reservation to Firebase Firestore
   * @param {Object} reservation
   */
  const sendToFirebase = async (reservation) => {
    // TODO: import { db } from './firebase-config.js';
    // TODO: await addDoc(collection(db, 'reservations'), reservation);
    console.info('[Firebase] Reservation would be sent:', reservation);
  };

  /**
   * Send confirmation email via EmailJS
   * @param {Object} reservation
   */
  const sendConfirmationEmail = async (reservation) => {
    // TODO: import emailjs from '@emailjs/browser';
    // TODO: await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    //   to_name:  reservation.name,
    //   to_email: reservation.email,
    //   date:     reservation.date,
    //   time:     reservation.time,
    //   guests:   reservation.guests
    // });
    console.info('[EmailJS] Confirmation would be emailed to:', reservation.email);
  };

  /* ---- Show Confirmation Modal ---- */
  const showConfirmation = (reservation) => {
    const modal = document.getElementById('reservation-modal');
    if (!modal) return;

    // Populate modal details
    const fields = {
      '#conf-name':   reservation.name,
      '#conf-date':   new Date(reservation.date).toLocaleDateString('en-US', {
                        weekday:'long', year:'numeric', month:'long', day:'numeric' }),
      '#conf-time':   reservation.time,
      '#conf-guests': `${reservation.guests} ${parseInt(reservation.guests) === 1 ? 'Guest' : 'Guests'}`,
      '#conf-ref':    reservation.ref
    };

    Object.entries(fields).forEach(([selector, value]) => {
      const el = modal.querySelector(selector);
      if (el) el.textContent = value;
    });

    modal.classList.add('open');
  };

  /* ---- Form Submission ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      window.EmmyApp?.Toast.show('Please fix the errors', 'Check the form fields highlighted in red.', 'error');
      return;
    }

    const btn = document.getElementById('res-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Confirming...';
    }

    const reservation = {
      ref:      'RES-' + Date.now(),
      name:     document.getElementById('res-name')?.value.trim(),
      phone:    document.getElementById('res-phone')?.value.trim(),
      email:    document.getElementById('res-email')?.value.trim(),
      date:     document.getElementById('res-date')?.value,
      time:     document.getElementById('res-time')?.value,
      guests:   document.getElementById('res-guests')?.value,
      requests: document.getElementById('res-requests')?.value.trim() || 'None',
      createdAt: new Date().toISOString()
    };

    // Simulate async (Firebase / EmailJS)
    await new Promise(r => setTimeout(r, 1000));

    try {
      // Save locally
      saveReservation(reservation);

      // Backend calls (placeholders)
      sendToFirebase(reservation);
      sendConfirmationEmail(reservation);

      // Reset form
      e.target.reset();
      document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));

      // Show success
      showConfirmation(reservation);
      window.EmmyApp?.Toast.show('Reservation Confirmed! 🍽️', `Ref: ${reservation.ref}`, 'success', 6000);

    } catch (err) {
      window.EmmyApp?.Toast.show('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Reserve My Table';
      }
    }
  };

  /* ---- Init ---- */
  const init = () => {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    setMinDate();

    // Real-time validation on blur
    Object.keys(rules).forEach(id => {
      document.getElementById(id)?.addEventListener('blur', () => validateField(id));
      document.getElementById(id)?.addEventListener('input', () => {
        const group = document.getElementById(id)?.closest('.form-group');
        if (group?.classList.contains('error')) validateField(id);
      });
    });

    form.addEventListener('submit', handleSubmit);

    // Close modal
    const modal = document.getElementById('reservation-modal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('open');
      }
    });
  };

  return { init, getAllReservations };
})();

document.addEventListener('DOMContentLoaded', () => Reservation.init());

window.EmmyReservation = Reservation;
