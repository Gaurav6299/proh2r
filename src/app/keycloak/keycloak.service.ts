import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare let Keycloak: any;

@Injectable()
export class KeycloakService {
	static auth: any = {};

	static init(): Promise<any> {
		const keycloakAuth: any = Keycloak({
			'realm': environment.realm,
			'auth-server-url': environment.keycloakUrl,
			'ssl-required': 'external',
			'clientId': 'loginclient',
			'public-client': true,
			"enable-cors": true
		});

		KeycloakService.auth.loggedIn = false;

		return new Promise((resolve, reject) => {
			keycloakAuth.init({ onLoad: 'login-required' , "checkLoginIframe": false })
				.success(() => {
					console.log(keycloakAuth);
					KeycloakService.auth.loggedIn = true;
					KeycloakService.auth.authz = keycloakAuth;
					KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl
						+ '/realms/' + environment.realm + '/protocol/openid-connect/logout?redirect_uri=' + document.baseURI;
					resolve();
				})
				.error(() => {
					reject();
				});
		});
	}

	static logout() {
		console.log('**  LOGOUT');
		KeycloakService.auth.loggedIn = false;
		KeycloakService.auth.authz = null;

		window.location.href = KeycloakService.auth.logoutUrl;
		localStorage.clear();
	}

	static getUsername(): string {
		localStorage.setItem("oauth", this.getMyToken());
		return KeycloakService.auth.authz.tokenParsed.preferred_username;
	}

	static getFullName(): string {
		return KeycloakService.auth.authz.tokenParsed.name;
	}

	getToken(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (KeycloakService.auth.authz.token) {
				KeycloakService.auth.authz
					.updateToken(5)
					.success(() => {
						resolve(<string>KeycloakService.auth.authz.token);
					})
					.error(() => {
						reject('Failed to refresh token');
					});
			} else {
				reject('Not logged in');
			}
		});
	}

	static getUserRole(): any {
		console.log(KeycloakService.auth.authz.tokenParsed.realm_access.roles);
		return KeycloakService.auth.authz.tokenParsed.realm_access.roles;
	}

	static getMyToken(): string {
		console.log(KeycloakService.auth.authz.token);
		return KeycloakService.auth.authz.token;
	}

	static getEmailId(): string {
		return KeycloakService.auth.authz.tokenParsed.email;
	}
}
