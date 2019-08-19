setInterval(() => {
  fetch('/read')
    .then((res) => res.json())
    .then((result) => {
      if (!result.empty) {
        console.log('result', result);
        const list = document.getElementsByClassName('messages')[0];
        const li = document.createElement('li');
        li.textContent = `${result.from}: ${result.cypher} => ${result.message}`;
        list.appendChild(li);
      }
    });
}, 1000);

function submitForm(ev) {
  const username = document.getElementById('username').value;
  const message = document.getElementById('message').value;
  fetch('/send', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({ username, message }),
  });
}

(function () {
  const cookies = document.cookie.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=');
    return { ...cookies, [name]: value };
  }, {});
  document.getElementById('user-title').textContent = cookies.username;
}());
