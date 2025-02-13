document.addEventListener('DOMContentLoaded', async ()=>{
    token = getTokenIfValid();
    if (token){
        const loginContainer = document.querySelector('div.menu_side_area');

        // get user info
        const id = getUserIdFromToken(token);
        const response = await fetch(`/user/${id}`);
        const user = await response.json();
        loginContainer.innerHTML = '';
        loginContainer.appendChild(createLogoutButton(user))
    }

    getBranches();

    rentForm();
})


const logout = ()=>{
    localStorage.removeItem('token');
    window.location.reload();
}

const createLogoutButton = (user)=>{
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    // const p = document.createElement('p');
    // p.textContent = user.username;

    const button = document.createElement('button');
    button.textContent = 'خروج از حساب';
    button.style.backgroundColor = '#7ac74f';
    button.style.borderRadius = '8px';
    button.style.border = 'none';
    button.style.padding = '4px 16px';
    button.style.color = 'white';


    button.addEventListener('click', logout)

    // div.appendChild(p);
    div.appendChild(button);

    return div;
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

const getBranches = async()=>{
    const response1 = await fetch ('/branches/');
    const all_branches = await response1.json();

    const response2 = await fetch ('/branches/?hasBike=true');
    const branches_with_bikes = await response2.json();

    const branchFromSelect = document.getElementsByClassName('branchFromSelect')[0];
    branchFromSelect.innerHTML =  '';

    branches_with_bikes.forEach(branch => {
        branchFromSelect.appendChild(createOptions(branch));
    });

    // add event to select tag's changes to update bikes
    branchFromSelect.addEventListener('change', (event)=>{
        const branch = event.target.value;
        getBikes(branch);
    })
    
    const branchToSelect = document.getElementsByClassName('branchToSelect')[0];
    branchToSelect.innerHTML =  '';

    all_branches.forEach(branch => {
        branchToSelect.appendChild(createOptions(branch));
    });
}

const createOptions = (branch)=>{
    const option = document.createElement('option');
    option.value = branch._id;
    option.textContent = branch.name;
    return option;
}

const getBikes = async(branch)=>{
    const response = await fetch (`/bikes/?branch=${branch}`);
    const bikes = await response.json();

    const bikeSelect = document.getElementsByClassName('bikeSelect')[0];
    bikeSelect.innerHTML =  '';
    
    removeDuplicateBikes(bikes).forEach(bike => {
        bikeSelect.appendChild(createBikeOptions(bike));
    });
}

function removeDuplicateBikes(bikes) {
    const seenModels = new Set(); // Create a Set to track seen models
    return bikes.filter(bike => {
        if (!seenModels.has(bike.model)) {
            seenModels.add(bike.model); // Add model to the Set
            return true; // Keep this bike
        }
        return false; // Remove this bike (duplicate)
    });
}

const createBikeOptions = (bike)=>{
    const option = document.createElement('option');
    option.value = bike._id;
    option.textContent = `${bike.model}`;
    return option;
}


const rentForm = ()=>{
    try {
        // --- Rent Form ---
        const rentForm = document.getElementById('contact_form');
        const success = document.getElementById('mail_success');
        const fail = document.getElementById('mail_fail');

        console.log("rent form is added to js")
        rentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // validate user is logged in
            token = getTokenIfValid();
            if (!token){
                fail.style.display = 'block';
                fail.textContent = "لطفا ابتدا وارد حساب خود شوید";
                setTimeout(() => {
                    fail.style.display = 'none';
                }, 4000);
                return;
            }
            
            const formData = new FormData(rentForm);
            formData.append('user', getUserIdFromToken(token));
            const dateStr = formData.get('startDate');
            const timeStr = formData.get('startHour');
            const combinedDateTimeStr = `${dateStr} ${timeStr}`;
            const startTime = new Date(combinedDateTimeStr);
            
            const dateEnd = formData.get('endDate');
            const timeEnd = formData.get('endHour');
            const combinedDateTimeEnd = `${dateEnd} ${timeEnd}`;
            const endTime = new Date(combinedDateTimeEnd);
            formData.append('startTime', startTime);
            formData.append('endTime', endTime);
            
            const data = Object.fromEntries(formData.entries()); // Convert to an object

            try {
                const response = await fetch('/rental/rent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    
                    success.style.display = 'block';
                    success.textContent = "ثبت دوچرخه با موفقیت انجام شد. میتوانید از حساب کاربری خود اطلاعات اجاره را ببینید.";
                    setTimeout(() => {
                        success.style.display = "none";
                    }, 4000);
                    
                } else {
                    const error = await response.json();
                    fail.style.display = 'block';
                    fail.textContent = "خطایی رخ داد";
                    setTimeout(() => {
                        fail.style.display = 'none';
                    }, 4000);
                }
            } catch (error) {
                console.error('Error:', error);
                fail.style.display = 'block';
                fail.textContent = "خطایی رخ داد";
                setTimeout(() => {
                    fail.style.display = 'none';
                }, 4000);
            }
        });
    } catch (error) {
        console.log(error.message)
        return
    }
}

