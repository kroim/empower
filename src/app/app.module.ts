import * as Raven from 'raven-js';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule, ErrorHandler} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import {environment} from '../environments/environment';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {ProblemComponent} from './components/problem/problem.component';
import {HowItWorksComponent} from './components/how-it-works/how-it-works.component';
import {SponsorComponent} from './components/sponsor/sponsor.component';
import {SubscribeToNewsletterComponent} from './components/subscribe-to-newsletter/subscribe-to-newsletter.component';
import {FooterComponent} from './components/footer/footer.component';
import {MyPageComponent} from './pages/my-page/my-page.component';
import {LoginComponent} from './pages/login/login.component';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {RegisterComponent} from './pages/register/register.component';
import {ConfirmComponent} from './pages/confirm/confirm.component';
import {HttpClientModule} from '@angular/common/http';
import {CookieModule} from 'ngx-cookie';
import {FaqComponent} from './pages/faq/faq.component';
import {AboutComponent} from './pages/about/about.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {LoadingModule} from 'ngx-loading';
import 'angular2-navigate-with-data';
import {CheckoutDoneComponent} from './pages/checkout-done/checkout-done.component';
import {TeamComponent} from './components/team/team.component';
import {AmbassadorComponent} from './pages/ambassador/ambassador.component';
import {TotaltCleaningStatsComponent} from './components/totalt-cleaning-stats/totalt-cleaning-stats.component';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {ShareComponent} from './pages/share/share.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {
    NgcCookieConsentModule,
    NgcCookieConsentConfig
} from 'ngx-cookieconsent';
import {BusinessComponent} from './pages/business/business.component';
import {AdminComponent} from './pages/admin-tools/admin/admin.component';
import {MakeAmbassadorComponent} from './pages/admin-tools/make-ambassador/make-ambassador.component';
import {AdminGuard} from './guards/admin.guard';
import {AmbassadorInfoComponent} from './pages/my-page/ambassador-info/ambassador-info.component';
import {MapComponent} from './pages/ambassador/map/map.component';
import {PageComponent} from './components/page/page.component';
import {HomeComponent} from './pages/home/home.component';
import {AboutShortComponent} from './components/about-short/about-short.component';
import {AboutFundComponent} from './components/about-fund/about-fund.component';
import {RedeemGiftComponent} from './pages/redeem-gift/redeem-gift.component';
import {ProblemShortComponent} from './components/problem-short/problem-short.component';
import {VideoComponent} from './components/video/video.component';
import {BlogComponent} from './pages/blog/blog.component';
import {BlogPostComponent} from './pages/blog-post/blog-post.component';
import {BlogExcerptComponent} from './components/blog-excerpt/blog-excerpt.component';
import {BlogContentContainerComponent} from './pages/blog-post/blog-content-container/blog-content-container.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {BrowserTransferStateModule} from '@angular/platform-browser';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {BlogAuthorBoxComponent} from './components/blog-author-box/blog-author-box.component';
import {GiftLandingComponent} from './pages/gift-landing/gift-landing.component';
import {SubscriptionComponent} from './pages/subscription/subscription.component';
import {WhyItWorksComponent} from './components/why-it-works/why-it-works.component';
import {AddWasteStationComponent} from './pages/admin-tools/add-waste-station/add-waste-station.component';
import {UpdateCryptoComponent} from './pages/admin-tools/update-crypto/update-crypto.component';
import {RemoveWasteStationComponent} from './pages/admin-tools/remove-waste-station/remove-waste-station.component';
import {ChristmasLandingNorComponent} from './pages/christmas-landing/christmas-landing-nor.component';
import {ChristmasLandingEngComponent} from './pages/christmas-landing/christmas-landing-eng.component';
import {ChristmasLandingBaseComponent} from './pages/christmas-landing/christmas-landing-base.component';
import {ExplorerComponent} from './pages/explorer/explorer.component';
import {AddPlasticWasteComponent} from './pages/admin-tools/add-plastic-waste/add-plastic-waste.component';
import { NewfooterComponent } from './new-pages/newfooter/newfooter.component';
import { NewheaderComponent } from './new-pages/newheader/newheader.component';
import { NewhomeComponent } from './new-pages/newhome/newhome.component';
import { NewaboutComponent } from './new-pages/newabout/newabout.component';
import { NewprivacyComponent } from './new-pages/newprivacy/newprivacy.component';
import { NewfaqComponent } from './new-pages/newfaq/newfaq.component';
import { NewloginComponent } from './new-pages/newlogin/newlogin.component';
import { NewregisterComponent } from './new-pages/newregister/newregister.component';
import { NewforgotpasswordComponent } from './new-pages/newforgotpassword/newforgotpassword.component';
import { NewaccountComponent } from './new-pages/newaccount/newaccount.component';
import { NewcheckoutComponent } from './new-pages/newcheckout/newcheckout.component';
import { NewcheckoutDoneComponent } from './new-pages/newcheckout-done/newcheckout-done.component';

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: 'empower.eco'
    },
    position: 'bottom',
    theme: 'edgeless',
    palette: {
        popup: {
            background: '#000000',
            text: '#ffffff'
        },
        button: {
            background: '#00e33a',
            text: '#ffffff'
        }
    },
    type: 'info',
    content: {
        message:
            'This website uses cookies to ensure you get the best experience on our website.',
        dismiss: 'Got it!',
        deny: 'Refuse cookies',
        link: 'Learn more',
        href: 'privacy'
    }
};

let ravenEnv = 'dev';
if (environment.production) {
    ravenEnv = 'prod';
}
Raven.config(
    'https://ec3781af0d944231a192c400a50a0108@sentry.io/1215337',
    {
        environment: ravenEnv,
    }
).install();

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any): void {
        Raven.captureException(err);
        if (!environment.production) {
            console.error(err);
        }
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ProblemComponent,
        HowItWorksComponent,
        WhyItWorksComponent,
        SponsorComponent,
        SubscribeToNewsletterComponent,
        FooterComponent,
        MyPageComponent,
        LoginComponent,
        RegisterComponent,
        ConfirmComponent,
        FaqComponent,
        AboutComponent,
        CheckoutComponent,
        CheckoutDoneComponent,
        TeamComponent,
        AmbassadorComponent,
        TotaltCleaningStatsComponent,
        ChangePasswordComponent,
        ForgotPasswordComponent,
        ShareComponent,
        PrivacyComponent,
        BusinessComponent,
        AdminComponent,
        MakeAmbassadorComponent,
        AmbassadorInfoComponent,
        MapComponent,
        PageComponent,
        HomeComponent,
        AboutShortComponent,
        AboutFundComponent,
        RedeemGiftComponent,
        ProblemShortComponent,
        VideoComponent,
        BlogComponent,
        BlogPostComponent,
        BlogExcerptComponent,
        BlogContentContainerComponent,
        NotFoundComponent,
        BlogAuthorBoxComponent,
        GiftLandingComponent,
        SubscriptionComponent,
        AddWasteStationComponent,
        AddPlasticWasteComponent,
        RemoveWasteStationComponent,
        UpdateCryptoComponent,
        ChristmasLandingBaseComponent,
        ChristmasLandingNorComponent,
        ChristmasLandingEngComponent,
        ExplorerComponent,
        NewfooterComponent,
        NewheaderComponent,
        NewhomeComponent,
        NewaboutComponent,
        NewprivacyComponent,
        NewfaqComponent,
        NewloginComponent,
        NewregisterComponent,
        NewforgotpasswordComponent,
        NewaccountComponent,
        NewcheckoutComponent,
        NewcheckoutDoneComponent,
    ],
    imports: [
        NgbModule,
        ModalModule.forRoot(),
        BrowserModule.withServerTransition({appId: 'my-app'}),
        BrowserTransferStateModule,
        HttpClientModule,
        FormsModule,
        NgcCookieConsentModule.forRoot(cookieConfig),
        AppRoutingModule,
        LoadingModule,
        NgxSmartModalModule.forRoot(),
        CookieModule.forRoot(),
        TransferHttpCacheModule,
    ],
    providers: [
        AuthService,
        AuthGuard,
        AdminGuard,
        {provide: ErrorHandler, useClass: RavenErrorHandler}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
