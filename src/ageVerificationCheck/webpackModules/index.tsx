import UserStore from '@moonlight-mod/wp/discord/stores/UserStore';

const getUser = () => UserStore.default.getCurrentUser();

function cleanup() {
	clearTimeout(tmo);
	clearInterval(int);
}

const int = setInterval(() => {
	const user = getUser();
	if (user?.ageVerificationStatus === undefined) return;

	if (user.ageVerificationStatus !== 3) alert('Oh no! No longer flagged as an adult!');
	else moonlight.getLogger('ageVerificationCheck').info('Age verification successful!');

	cleanup();
}, 1_000);

const tmo = setTimeout(() => {
	alert('Timed out after trying for 30s to check age verification status');
	cleanup();
}, 30_000);
