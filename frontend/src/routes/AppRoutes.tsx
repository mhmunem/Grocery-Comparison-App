import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router";

import Home from "../pages/HomePage/HomePage";
import Search from "../pages/SearchPage/SearchPage";
import ShoppingList from "../pages/ShoppingListPage/ShoppingListPage";
import Account from "../pages/AccountPage/AccountPage";

const AppRoutes: React.FC = () => (
    <IonRouterOutlet>
    <Redirect exact path="/" to="/home" />

    <Route path="/home" render={() => <Home />} exact={true} />
    <Route path="/search" render={() => <Search />} exact={true} />
    <Route path="/shoppinglist" render={() => <ShoppingList />} exact={true} />
    <Route path="/account" render={() => <Account />} exact={true} />
  </IonRouterOutlet>
);

export default AppRoutes;