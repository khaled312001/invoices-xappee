
export const loginPassword = async (email: string, password: string) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!url) {
        console.error("NEXT_PUBLIC_SERVER_URL is not defined");
        return { status: 500, data: { error: "Configuration error" } };
    }

    try {
        const res = await fetch(`${url}/auth/login/password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        return { status: res.status, data };
    } catch (error) {
        console.error("Login request failed", error);
        return { status: 500, data: { error: "Network error" } };
    }
};

export const authCallback = async (
    email: string,
    displayName: string,
    image: string
) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!url) {
        console.error("NEXT_PUBLIC_SERVER_URL is not defined");
        return { status: 500, data: { error: "Configuration error" } };
    }

    try {
        const res = await fetch(`${url}/auth/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, displayName, image }),
        });

        // Check if response is ok
        if (!res.ok) {
            console.error("Auth callback failed with status:", res.status);
            // Attempt to parse error
            try {
                const errorData = await res.json();
                return { status: res.status, data: errorData };
            } catch (e) {
                return { status: res.status, data: { error: res.statusText } };
            }
        }

        const data = await res.json();
        return { status: res.status, data };
    } catch (error) {
        console.error("Auth callback request failed", error);
        return { status: 500, data: { error: "Network error" } };
    }
};

export const signout = async (token: string) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!url) return false;

    try {
        const res = await fetch(`${url}/auth/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.ok;
    } catch (error) {
        console.error("Signout request failed", error);
        return false;
    }
};
