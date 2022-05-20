import { TriangleWaveConnector } from "./triangle-wave-connector";
import { ready, newInstance } from "@jsplumb/browser-ui"

ready(() => {
    
    const instance = newInstance({
        container:document.querySelector(".demo"),
        anchors:["Right", "Left"]
    })

    instance.connect({
        source:document.getElementById("w1"),
        target:document.getElementById("w2"),
        connector:TriangleWaveConnector.type,
    })

    instance.connect({
        source:document.getElementById("w3"),
        target:document.getElementById("w4"),
        connector:{
            type:TriangleWaveConnector.type,
            options:{
                spring:true
            }
        }
    })    
})

