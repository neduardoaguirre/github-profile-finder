const form = document.querySelector('#form');
const result = document.querySelector('#result');

window.onload = () => {
    form.addEventListener('submit', readName);
};

function readName(e) {
    e.preventDefault();
    const user = document.querySelector('#search').value;
    if (user === '') {
        alert('Ingrese el perfil que desea buscar');
        return;
    }
    getProfile(user);
}

async function getProfile(username) {
    const url = 'https://api.github.com/users/';
    try {
        const res = await fetch(url + username);
        const data = await res.json();
        data.login ? showProfile(data) : alert('Perfil Inexistente');
    } catch (error) {
        console.log(error);
    }
}

function showProfile(profile) {
    const {
        avatar_url,
        bio,
        html_url,
        login,
        name,
        followers,
        following,
        public_repos,
        repos_url,
    } = profile;

    result.innerHTML = `
        <div class="flex flex-col md:flex-row p-4 md:p-6 justify-around items-center md:items-start">
            <div class="flex-initial mx-5">
                <img src="${avatar_url}" alt="${name}"
                    class="rounded-full h-40 w-40 border-solid border-4 border-purple-900">
            </div>
            <div class="justify-center items-center flex-1 mt-3 md:mt-0">
                <h1 class="text-center" id="profile-name"></h1>
                <h2 class="text-center font-bold mt-2">${login}<a href="${html_url}" target="_blank" rel="noopener noreferrer"
                class="ml-2"><img src="img/icon.svg" class="w-5 h-5 inline-block mb-1 git"></a></h2>
                <p id="bio"></p>
                <ul class="flex justify-center mt-2">
                    <li class="p-2 mr-2 text-center"><strong>${followers}</strong> Seguidores</li>
                    <li class="p-2 mr-2 text-center"><strong>${following}</strong> Seguidos</li>
                    <li class="p-2 text-center"><strong>${public_repos}</strong> Repos</li>
                </ul>
                <div class="mt-3 p-1 flex flex-wrap justify-center" id="div-repos"></div>
            </div>
        </div>
    `;

    if (bio !== null && name !== null) {
        const profileName = document.querySelector('#profile-name');
        profileName.classList.add('font-bold', 'text-2xl');
        profileName.textContent = name;
        const profileBio = document.querySelector('#bio');
        profileBio.classList.add('text-center', 'mt-3');
        profileBio.textContent = bio;
    }

    getRepos(repos_url);
    form.reset();
}

function addRepos(repos) {
    const divRepos = document.querySelector('#div-repos');
    repos.sort((a, b) => b.id - a.id);
    const selection = repos.slice(0, 8);

    selection.forEach((repo) => {
        const rep = document.createElement('a');
        rep.classList.add(
            'inline-block',
            'rounded-lg',
            'py-1',
            'px-2',
            'mr-1',
            'mb-1',
            'bg-blue-600',
            'text-center',
            'text-base',
            'text-white'
        );
        rep.href = repo.html_url;
        rep.target = '_blank';
        rep.rel = 'noopener noreferrer';
        rep.innerText = repo.name;
        divRepos.appendChild(rep);
    });
}

async function getRepos(urlRepos) {
    try {
        const res = await fetch(urlRepos);
        const data = await res.json();
        if (data.length > 0) {
            addRepos(data);
        }
    } catch (error) {
        console.log(error);
    }
}

function alert(msg) {
    cleanHTML();
    const previousAlert = document.querySelector('.alert');
    if (!previousAlert) {
        const divAlert = document.createElement('div');
        divAlert.classList.add(
            'bg-red-700',
            'mt-3',
            'p-3',
            'text-center',
            'font-bold',
            'text-white',
            'rounded-full',
            'max-w-sm',
            'mx-auto',
            'alert',
            'uppercase'
        );
        divAlert.textContent = msg;
        form.appendChild(divAlert);

        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }
}

function cleanHTML() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}
