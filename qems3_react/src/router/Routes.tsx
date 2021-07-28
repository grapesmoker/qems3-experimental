import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import React from "react";

// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }) {
    // console.log('rendering private route')
    // console.log('children: ', children)
    console.log('rest', rest)
    return (
        <Route
            {...rest}
            render={({ location }) =>
                rest.user ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}
