window.onload = function(){
    show_section('register');
    show_books();
    show_section('register');
}

function show_section(sectionId){

    let sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';

    const positions = {
        register: '170px',
        browse: '270px',
        borrow: '370px',
        return: '470px'
    };

    document.getElementById('tab-selector').style.top = positions[sectionId];

    document.querySelectorAll('.button_tab').forEach(button => {
        button.classList.remove('active-tab');
    });

    document.getElementById('tab-' + sectionId).classList.add('active-tab');
}

// Example dummy member
let members = [
    {
        member_id: 1,
        name: "John Doe",
        email: "john@example.com",
        birthday: "2000-01-01",
        borrowed: []
    },
    {
        member_id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        birthday: "1999-05-10",
        borrowed: []
    }
];

function register() {
    let name     = document.getElementById('r-name').value;
    let email    = document.getElementById('r-email').value;
    let birthday = document.getElementById('r-bday').value;
    let tos      = document.getElementById('r-tos').checked;
 
    document.getElementById('e-name').innerHTML  = '';
    document.getElementById('e-email').innerHTML = '';
    document.getElementById('e-bday').innerHTML  = '';
    document.getElementById('e-tos').innerHTML   = '';
    document.getElementById('r-ok').innerHTML    = '';
 
    let valid = true;
 
    if (name == '') {
        document.getElementById('e-name').innerHTML = 'Name must be filled';
        valid = false;
    }
    if (email == '') {
        document.getElementById('e-email').innerHTML = 'Email must be filled';
        valid = false;
    }
    if (birthday == '') {
        document.getElementById('e-bday').innerHTML = 'Birthday must be filled';
        valid = false;
    }
    if (tos == false) {
        document.getElementById('e-tos').innerHTML = 'You must agree to the Terms of Service';
        valid = false;
    }

    if (valid) {
        let newMember = {
            member_id:  members.length + 1,
            name:       name,
            email:      email,
            birthday:   birthday,
            borrowed:   []
        };
 
        members.push(newMember);
 
        document.getElementById('r-ok').innerHTML =
            'Registration complete! Your member ID is: ' + newMember.member_id;
 
        console.log('Members so far:', members);
    }
}
 

let books = [
    { book_id: 'B001', book_name: 'The Great Gatsby',      author: 'F. Scott Fitzgerald',  genre: 'Classic',     year: 1925, status: 1 },
    { book_id: 'B002', book_name: 'To Kill a Mockingbird', author: 'Harper Lee',           genre: 'Fiction',     year: 1960, status: 0, borrowedBy: 1, returnBy: '2026-06-15'},
    { book_id: 'B003', book_name: '1984',                  author: 'George Orwell',        genre: 'Dystopia',    year: 1949, status: 0, borrowedBy: 2, returnBy: '2026-05-01' },
    { book_id: 'B004', book_name: 'Sapiens',               author: 'Yuval Noah Harari',    genre: 'Non-fiction', year: 2011, status: 1 },
    { book_id: 'B005', book_name: 'Dune',                  author: 'Frank Herbert',        genre: 'Sci-fi',      year: 1965, status: 1 },
];

function updateOverdueBooks() {
    let today = new Date();

    for (let i = 0; i < books.length; i++) {
        let book = books[i];

        if (book.status == 0 && book.returnBy) {
            let dueDate = new Date(book.returnBy);

            if (today > dueDate) {
                book.status = -1;
            }
        }
    }
}

function getMemberName(memberId) {
    for (let i = 0; i < members.length; i++) {
        if (String(members[i].member_id) == String(memberId)) {
            return members[i].name;
        }
    }
    return '-';
}

function show_books() {
    updateOverdueBooks();

    let tbody = document.getElementById('book-rows');
    tbody.innerHTML = '';
 
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
 
        tbody.innerHTML += `
            <tr>
                <td>${book.book_id}</td>
                <td>${book.book_name}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.year}</td>
                <td>
                    ${
                        book.status == 1
                        ? '<span class="status-badge status-available">Available</span>'
                        : book.status == 0
                        ? '<span class="status-badge status-borrowed">Borrowed</span>'
                        : '<span class="status-badge status-overdue">Overdue</span>'
                    }
                </td>
                <td>
                    ${book.borrowedBy ?
                        getMemberName(book.borrowedBy) +
                        ' (ID: ' + book.borrowedBy + ')' :
                        '-'}
                </td>
            </tr>
        `;
    }
}

function borrowBook() {
    let member_id = document.getElementById('b-mid').value;
    let book_id   = document.getElementById('b-bid').value;
    let ret_date  = document.getElementById('b-ret').value;

    document.getElementById('e-bmid').innerHTML = '';
    document.getElementById('e-bbid').innerHTML = '';
    document.getElementById('e-bret').innerHTML = '';
    document.getElementById('b-ok').innerHTML   = '';
 
    let valid = true;
 
    if (member_id == '') {
        document.getElementById('e-bmid').innerHTML = 'Member ID must be filled';
        valid = false;
    }
    if (book_id == '') {
        document.getElementById('e-bbid').innerHTML = 'Book ID must be filled';
        valid = false;
    }
    if (ret_date == '') {
        document.getElementById('e-bret').innerHTML = 'Return date must be filled';
        valid = false;
    }
    if (!valid) return;
 
    let member = null;
    for (let i = 0; i < members.length; i++) {
        if (String(members[i].member_id) == member_id) {
            member = members[i];
        }
    }
    if (member == null) {
        document.getElementById('e-bmid').innerHTML = 'Member ID not found';
        return;
    }

    let book = null;
    for (let i = 0; i < books.length; i++) {
        if (books[i].book_id == book_id) {
            book = books[i];
        }
    }
    if (book == null) {
        document.getElementById('e-bbid').innerHTML = 'Book not found';
        return;
    }

    if (book.status == 0) {
        document.getElementById('e-bbid').innerHTML = 'This book has already been borrowed';
        return;
    }

    book.status     = 0;
    book.returnBy   = ret_date;
    book.borrowedBy = member_id;
    member.borrowed.push(book_id);
 
    document.getElementById('b-ok').innerHTML =
        '"' + book.book_name + '" borrowed! Please return by ' + ret_date;
 
    show_books();
}

function returnBook() {
    let book_id = document.getElementById('ret-bid').value;
 
    document.getElementById('e-ret').innerHTML  = '';
    document.getElementById('ret-ok').innerHTML = '';
 
    if (book_id == '') {
        document.getElementById('e-ret').innerHTML = 'Book ID must be filled';
        return;
    }
 
    let book = null;
    for (let i = 0; i < books.length; i++) {
        if (books[i].book_id == book_id) {
            book = books[i];
        }
    }
    if (book == null) {
        document.getElementById('e-ret').innerHTML = 'Book not found';
        return;
    }
 
    if (book.status == 1) {
        document.getElementById('e-ret').innerHTML =
            'This book is not currently borrowed';
        return;
    }
 
    let today    = new Date();
    let dueDate  = new Date(book.returnBy);
    let overdue  = today > dueDate;
 
    if(overdue){
        openOverdueModal();
    }

    book.status = 1;
    delete book.returnBy;
    delete book.borrowedBy;
 
    document.getElementById('ret-ok').innerHTML = overdue
        ? '"' + book.book_name + '" returned — this was overdue!'
        : '"' + book.book_name + '" returned successfully. Thank you!';
 
    document.getElementById('ret-bid').value = '';
 
    show_books();
}

function show_section(sectionId) {

    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.button_tab').forEach(btn => {
        btn.classList.remove('active-tab');
    });

    const activeBtn = document.getElementById('tab-' + sectionId);
    activeBtn.classList.add('active-tab');

    const highlight = document.getElementById('tab-highlight');
    highlight.style.transform =`translateY(${activeBtn.offsetTop}px)`;
}

function openTOS() {
    document.getElementById('tos-modal').style.display = 'flex';
}

function closeTOS() {
    document.getElementById('tos-modal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('tos-modal');

    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function openOverdueModal() {
    document.getElementById('overdue-modal').style.display = 'flex';
}

function closeOverdueModal() {
    document.getElementById('overdue-modal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('overdue-modal');

    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
