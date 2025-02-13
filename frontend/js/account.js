document.addEventListener('DOMContentLoaded', async ()=>{
    token = getTokenIfValid();
    if (token){
        const loginContainer = document.querySelector('div.menu_side_area');
        loginContainer.innerHTML = '';

        // get user info
        const id = getUserIdFromToken(token);
        const response = await fetch(`/user/${id}`);
        const user = await response.json();
        console.log(user);
        fillUserInfo(user);
        getRentals(id);

    } else {
        window.location.href = "/login.html";
    }
})


const logout = ()=>{
    localStorage.removeItem('token');
    window.location.reload();
}



function getUserIdFromToken(token) {
    try {
      const decodedToken = jwt_decode(token);
      // Assuming the user ID is stored in a claim called 'userId' or 'sub' (subject)
      // Adjust the claim name if your JWT uses a different name for the user ID
      const userId = decodedToken.userId;
  
      if (userId === undefined) {
        console.warn("User ID claim not found in JWT.");
        return null;
      }

      return userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
}


function getTokenIfValid() {
    const token = localStorage.getItem('token');

    if (!token) {
        return false; // No token found
    }

    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token'); // Remove expired token
            return false;
        } else {
            // Token is valid
            return token;
        }
    } catch (error) {
        // Handle invalid token format
        console.error("Invalid token:", error);
        localStorage.removeItem('token'); // Remove invalid token
        return false;
    }
}


const fillUserInfo = (user)=>{
    const nameTag = document.querySelector('div.profile_name h4');
    nameTag.textContent = user.name;
    const emailTag = document.querySelector('div.profile_name span');
    emailTag.textContent = user.email;
}

const getRentals = async(id)=>{
    console.log('user id is : ' , id);
    const response = await fetch(`/rental/${id}`)

    console.log(response)

    const rentals = await response.json();

    const tableBody = document.querySelector('table.table tbody');
    tableBody.innerHTML = '';

    rentals.forEach(rental => {
        tableBody.appendChild(createRentRow(rental))
    });
}

const createRentRow = (rental)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><span class="d-lg-none d-sm-block">شماره اجرا</span><div class="badge bg-gray-100 text-dark">#${rental.rentalCode}</div></td>
        <td><span class="d-lg-none d-sm-block">نوع دوچرخه</span><span class="bold">${rental.bike.model}</span></td>
        <td><span class="d-lg-none d-sm-block">شعبه تحویل</span>${rental.branchFrom.name}</td>
        <td><span class="d-lg-none d-sm-block">شعبه عودت</span>${rental.branchTo.name}</td>
        <td><span class="d-lg-none d-sm-block">تاریخ تحویل</span>${rental.startTime}</td>
        <td><span class="d-lg-none d-sm-block">تاریخ عودت</span>${rental.endTime}</td>
        <td><div class="badge rounded-pill bg-warning">جاری</div></td>
    `
    return tr;
}