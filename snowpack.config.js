module.exports ={
    "optimize":{
        bundle:true,
        minify:true,
        target:"es2018",
        sourcemap:"inline"
    },
    mount:{

        public:"/",
        src:"/src"
    },
    plugins:[
        "@snowpack/plugin-svelte",
        ["@snowpack/plugin-typescript",{args:"-p ."}],
        ["@snowpack/plugin-sass",{

        compilerOptions:{
            loadPath:"./src/css"
        }
        }]
    ]
}

/*
   experiments:{

        "optimize":{
            bundle:true,
            minify:true,
            target:"es2018"
        }
    },
 */