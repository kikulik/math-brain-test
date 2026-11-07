/* Math Brain Test: rows of chunky radio buttons on the start screen (age, timer). */
(function (M) {
  /* options: [[value, label], ...]. onChange gets the newly picked value. */
  M.picker = ({ el, name, options, selected, onChange }) => {
    const box = document.querySelector(el);
    box.innerHTML = options.map(([value, label]) =>
      `<label><input type="radio" name="${name}" value="${value}"${value === selected ? ' checked' : ''}><span>${label}</span></label>`).join('');
    box.addEventListener('change', () => onChange(M.picked(name)));
  };
  M.picked = name => document.querySelector(`input[name="${name}"]:checked`)?.value;
})(window.MBT);
