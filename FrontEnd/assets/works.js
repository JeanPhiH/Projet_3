
const works = await fetch('http://localhost:5678/api/works').then(res => res.json());



console.log(works);