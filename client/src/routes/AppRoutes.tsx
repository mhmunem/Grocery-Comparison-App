import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router";

import Home from "../pages/HomePage/HomePage";
import Search from "../pages/SearchPage/SearchPage";
import ShoppingList from "../pages/ShoppingListPage/ShoppingListPage";
import Account from "../pages/AccountPage/AccountPage";
import Store from "../pages/StorePage/StorePage"
import About from "../pages/About/About"


const AppRoutes: React.FC = () => (
  <IonRouterOutlet>
    <Redirect exact path="/" to="/about" />
    <Route path="/stores" render={() => <Store />} exact={true} />
    <Route path="/home" render={() => <Home />} exact={true} />
    <Route path="/search" render={() => <Search />} exact={true} />
    <Route path="/shoppinglist" render={() => <ShoppingList />} exact={true} />
    <Route path="/account" render={() => <Account />} exact={true} />
    <Route path="/about" render={() => <About />} exact={true} />
  </IonRouterOutlet>
);

export default AppRoutes;