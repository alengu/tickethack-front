const apiUrl = "https://tickethack-back-gray.vercel.app";
const userID = getCookie("token");
const connectedUserName=getCookie("username")

if (userID) {
  document.querySelector("#user-connected-name").style.display = "flex";
  document.querySelector("#user-connected-name").textContent =
  connectedUserName;
}

const signup = async () => {
  document.querySelector("#register").addEventListener("click", async () => {
    let firstName = document.querySelector("#registerFirstName").value;
    let lastName = document.querySelector("#registerLastName").value;
    let email = document.querySelector("#registerEmail").value;
    let password = document.querySelector("#registerPassword").value;

    const responseSignup = await fetch(`${apiUrl}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const signup = await responseSignup.json();

    try {
      alert(`Hello ${signup.firstName} ${signup.lastName}!`);
      document.cookie = `username=${signup.firstName}; path=/; max-age=86400; Secure; SameSite=Strict`;
      document.cookie = `token=${signup._id}; path=/; max-age=86400; Secure; SameSite=Strict`;

    } catch (exception) {
      console.log("signup fail");
    }
  });
};

const signin = async () => {
  document.querySelector("#connection").addEventListener("click", async () => {
    let email = document.querySelector("#connectionEmail").value;
    let password = document.querySelector("#connectionPassword").value;

    const responseSignin = await fetch(`${apiUrl}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const signin = await responseSignin.json();

    try {
      alert(`Hello ${signin.firstName} ${signin.lastName}!`);
      document.cookie = `username=${signin.firstName}; path=/; max-age=86400; Secure; SameSite=Strict`;
      document.cookie = `token=${signin._id}; path=/; max-age=86400; Secure; SameSite=Strict`;
    } catch (exception) {
      console.log("signin fail");
    }
  });
};

signup();
signin();
