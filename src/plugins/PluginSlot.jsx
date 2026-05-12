import React, { useState, useEffect } from 'react';
import { getPlugin, subscribe } from './pluginRegistry';

export function PluginSlot({ scope, props }) {
    const [Component, setComponent] = useState(() => getPlugin(scope));

    useEffect(() => {
        return subscribe(() => setComponent(() => getPlugin(scope)));
    }, [scope]);

    if (!Component) return null;
    return <Component {...props} />;
}
