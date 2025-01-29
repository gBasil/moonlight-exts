import { ModuleExportType } from '@moonlight-mod/types';

import spacepack from '@moonlight-mod/wp/spacepack_spacepack';

moonlight.moonmap.addModule(
	spacepack.findByCode('ComponentDispatchUtils')[0].id.toString(),
	'discord/utils/ComponentDispatchUtils'
);
moonlight.moonmap.addExport(
	'discord/utils/ComponentDispatchUtils', 'ComponentDispatcher',
	{
		type: ModuleExportType.Key,
		find: 'emitter'
	}
);
moonlight.moonmap.addExport(
	'discord/utils/ComponentDispatchUtils', 'ComponentDispatch',
	{
		type: ModuleExportType.Function,
		find: 'emitter'
	}
);
