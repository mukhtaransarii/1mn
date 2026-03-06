import { createApp } from "vue";
import type { _p_TYP, _$cb_TYP, _$p_TYP } from "../shared/types";
import Comp from "./index.vue";

const index = async (_p: _p_TYP) => {
    return {
        set: async (_$p: _$p_TYP, _$cb?: _$cb_TYP) => {
            console.log(`--hydrator [${_$p[`data`][`curr`].type}]`);

            // 1. Prepare Props
            const props = {
                _p: _p,
                _$p: _$p,
                _$cb: _$cb,
            };

            

            // 2. Create the App
            const app = createApp(Comp, props);

            // 3. Generate a unique ID for the root element
            const rootId = _p.f.name("vue-root");

            // 4. Return the HTML structure to the host
            const _$r = {
                r: (() => {
                    // This string creates the div in the DOM
                    return `<div id="${rootId}" style="width:100%; height:100%;"></div>`;
                })(),
                style: (() => {
                    return ``;
                })(),
                evt: {
                    change: () => {
                        _$cb?.change({ _$p: _$p });
                    }
                }
            };

            // 5. Mount Vue (Delayed slightly to allow the HTML string above to be rendered)
            setTimeout(() => {
                const mountEl = document.getElementById(rootId);
                if (mountEl) {
                    app.mount(mountEl);
                } else {
                    console.error(`Hydrator Error: Element #${rootId} not found.`);
                }
            }, 0);

            return _$r;
        },
    };
}

export { index, index as hydrator };