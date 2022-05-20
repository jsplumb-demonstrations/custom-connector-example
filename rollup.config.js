import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input:"index.js",
        output:[
            {
                name: "JsPlumbCustomConnector",
                file: `build/index.js`,
                format: 'umd'
            }
        ],
        plugins:[
            resolve({ extensions:[ ".js" ] }),
        ]
    }
]