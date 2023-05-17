import './style.css';
import { Data, User } from './types';

enum Categories {
	gender = 'gender',
	name = 'name',
	location = 'location',
	email = 'email',
}

let randomUsers: User[] = [];
const myTable = document.querySelector<HTMLTableElement>('#table')!;
const myTableRow = document.querySelector<HTMLTableRowElement>('#table-row')!;
const myInput = document.querySelector<HTMLInputElement>('#input')!;

const renderTable = () => {
	myTable.children[1].innerHTML = randomUsers
		.map(
			(user) =>
				`<tr class="${user.hidden && 'hidden'}">
          <td>${user.gender}</td>
          <td>
            ${user.name.title} ${user.name.first} ${user.name.last}
          </td>
          <td>
            ${user.location.street.name} ${user.location.street.number}, ${
					user.location.city
				}, ${user.location.country}
          </td>
          <td>${user.email}</td>
        </tr>`
		)
		.join('');
};

const handleSort = (header: Categories) => {
	randomUsers = [...randomUsers].sort((a, b) => {
		const nameA =
			header === Categories.gender || header === Categories.email
				? a[header].toUpperCase()
				: header === Categories.location
				? a[header].street.name.toUpperCase()
				: a[header].first.toUpperCase();
		const nameB =
			header === Categories.gender || header === Categories.email
				? b[header].toUpperCase()
				: header === Categories.location
				? b[header].street.name.toUpperCase()
				: b[header].first.toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	renderTable();
};

const addClickEvent = (child: ChildNode, category: Categories) => {
	child.addEventListener('click', () => {
		handleSort(category);
	});
};

const getData = async () => {
	const res = await fetch('https://randomuser.me/api/?results=20');
	const data: Data = await res.json();
	randomUsers = data.results.map((user) => {
		return { ...user, hidden: false };
	});
	renderTable();
};

getData();

myTableRow.childNodes.forEach((child) => {
	if (child.textContent?.toLowerCase() === Categories.gender) {
		addClickEvent(child, Categories.gender);
	}
	if (child.textContent?.toLowerCase() === Categories.name) {
		addClickEvent(child, Categories.name);
	}
	if (child.textContent?.toLowerCase() === Categories.location) {
		addClickEvent(child, Categories.location);
	}
	if (child.textContent?.toLowerCase() === Categories.email) {
		addClickEvent(child, Categories.email);
	}
});

myInput.addEventListener('change', () => {
	console.log(myInput.value);
	randomUsers = randomUsers.map((user) => {
		if (!user.name.first.toLowerCase().includes(myInput.value)) {
			return { ...user, hidden: true };
		} else {
			return { ...user, hidden: false };
		}
	});
	console.log(randomUsers);
	renderTable();
});
