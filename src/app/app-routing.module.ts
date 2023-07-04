import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyPageComponent } from "./pages/my-page/my-page.component";
import { AuthGuard } from "./guards/auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ConfirmComponent } from "./pages/confirm/confirm.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { AboutComponent } from "./pages/about/about.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { CheckoutDoneComponent } from "./pages/checkout-done/checkout-done.component";
import { AmbassadorComponent } from "./pages/ambassador/ambassador.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { ShareComponent } from "./pages/share/share.component";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
import { BusinessComponent } from "./pages/business/business.component";
import { AdminComponent } from "./pages/admin-tools/admin/admin.component";
import { AdminGuard } from "./guards/admin.guard";
import { HomeComponent } from "./pages/home/home.component";
import { RedeemGiftComponent } from "./pages/redeem-gift/redeem-gift.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { BlogPostComponent } from "./pages/blog-post/blog-post.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { SubscriptionComponent } from "./pages/subscription/subscription.component";
import { ChristmasLandingNorComponent } from "./pages/christmas-landing/christmas-landing-nor.component";
import { ChristmasLandingEngComponent } from "./pages/christmas-landing/christmas-landing-eng.component";
import { ExplorerComponent } from "./pages/explorer/explorer.component";
import {NewhomeComponent} from './new-pages/newhome/newhome.component';
import {NewaboutComponent} from './new-pages/newabout/newabout.component';

const routes: Routes = [
  {
    path: "",
    component: NewhomeComponent
  },
  {
    path: "faq",
    component: FaqComponent
  },
  {
    path: "about",
    component: NewaboutComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "confirm",
    component: ConfirmComponent
  },
  {
    path: "my-page",
    component: MyPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ambassador",
    component: AmbassadorComponent
  },
  {
    path: "ambassador/:id",
    component: AmbassadorComponent
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "checkout-done",
    component: CheckoutDoneComponent
  },
  {
    path: "change-password",
    component: ChangePasswordComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "share",
    component: ShareComponent
  },
  {
    path: "privacy",
    component: PrivacyComponent
  },
  /*{
    path: "business",
    component: BusinessComponent
  },*/
  {
    path: "admin-tools",
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: "redeem-gift",
    component: RedeemGiftComponent
  },
  {
    path: "blog",
    component: BlogComponent
  },
  {
    path: "blog/:id",
    component: BlogPostComponent
  },
  /*{
    path: "gift",
    component: GiftLandingComponent
  },*/
  {
    path: "julegave",
    component: ChristmasLandingNorComponent
  },
  {
    path: "christmasgift",
    component: ChristmasLandingEngComponent
  },
  {
    path: "explorer",
    component: ExplorerComponent
  },
  {
    path: "subscription",
    component: SubscriptionComponent
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
