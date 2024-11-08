import { AuthClient } from "@dfinity/auth-client";
import { backend } from "declarations/backend";

let authClient;

const init = async () => {
    authClient = await AuthClient.create();
    
    // Check if user is already authenticated
    if (await authClient.isAuthenticated()) {
        handleAuthenticated();
    }
};

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const loginSection = document.getElementById("loginSection");
const userSection = document.getElementById("userSection");
const principalId = document.getElementById("principalId");
const spinner = document.getElementById("spinner");

loginButton.onclick = async () => {
    spinner.style.display = "inline-block";
    
    await authClient.login({
        identityProvider: "https://nfid.one",
        onSuccess: async () => {
            handleAuthenticated();
        },
        onError: (error) => {
            console.error("Login failed:", error);
            spinner.style.display = "none";
        }
    });
};

logoutButton.onclick = async () => {
    spinner.style.display = "inline-block";
    
    try {
        await backend.logout();
        await authClient.logout();
        loginSection.style.display = "block";
        userSection.style.display = "none";
        principalId.textContent = "";
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        spinner.style.display = "none";
    }
};

async function handleAuthenticated() {
    spinner.style.display = "inline-block";
    
    try {
        const loginResult = await backend.login();
        if ('ok' in loginResult) {
            const principal = await backend.whoami();
            loginSection.style.display = "none";
            userSection.style.display = "block";
            principalId.textContent = `Principal ID: ${principal}`;
        } else {
            console.error("Backend login failed:", loginResult.err);
        }
    } catch (error) {
        console.error("Authentication handling failed:", error);
    } finally {
        spinner.style.display = "none";
    }
}

init();
