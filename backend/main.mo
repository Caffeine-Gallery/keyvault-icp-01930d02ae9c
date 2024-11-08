import Bool "mo:base/Bool";
import Int "mo:base/Int";

import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Result "mo:base/Result";

actor {
    // Store user sessions with timestamp
    private var sessions = HashMap.HashMap<Principal, Int>(10, Principal.equal, Principal.hash);

    // Check if user is authenticated
    public shared(msg) func isAuthenticated() : async Bool {
        let caller = msg.caller;
        switch (sessions.get(caller)) {
            case (?timestamp) {
                // Session exists
                true
            };
            case null {
                false
            };
        };
    };

    // Login user
    public shared(msg) func login() : async Result.Result<Text, Text> {
        try {
            let caller = msg.caller;
            if (Principal.isAnonymous(caller)) {
                return #err("Anonymous principal not allowed");
            };
            
            sessions.put(caller, Time.now());
            #ok("Successfully logged in")
        } catch (e) {
            #err(Error.message(e))
        };
    };

    // Logout user
    public shared(msg) func logout() : async Result.Result<Text, Text> {
        try {
            let caller = msg.caller;
            sessions.delete(caller);
            #ok("Successfully logged out")
        } catch (e) {
            #err(Error.message(e))
        };
    };

    // Get caller principal
    public shared(msg) func whoami() : async Text {
        Principal.toText(msg.caller)
    };
}
