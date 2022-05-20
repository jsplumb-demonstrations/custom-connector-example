import { AbstractConnector, Connectors, StraightSegment } from "@jsplumb/core"

// this function takes a point from the midline and projects it to the
// upper or lower guideline.
function translatePoint(from, n, upper, amplitude) {
    const dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;
    const duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
    return [
        from[0] - ((upper ? -1 : 1) * dux),
        from[1] + ((upper ? -1 : 1) * duy)
    ];
}

// this function returns a point on the line connecting
// the two anchors, at a given distance from the start
function pointOnLine(from, m, distance) {
    const dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
    const duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
    return [
        from[0] + dux,
        from[1] + duy
    ];
}

export class TriangleWaveConnector extends AbstractConnector {

    static type = "TriangleWave"
    type = TriangleWaveConnector.type

    wavelength
    amplitude
    spring
    compressedThreshold

    constructor(connection, params) {
        super(connection, params)
        params = params || {}
        this.wavelength = params.wavelength || 10
        this.amplitude = params.amplitude || 10
        this.spring = params.spring
        this.compressedThreshold = params.compressedThreshold || 5
    }

    getDefaultStubs(){
        return [0, 0]
    }


    _compute (paintInfo, paintParams) {

        let dx = paintInfo.endStubX - paintInfo.startStubX,
            dy = paintInfo.endStubY - paintInfo.startStubY,
            d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),  // absolute delta
            m = Math.atan2(dy, dx),
            n = Math.atan2(dx, dy),
            origin = [ paintInfo.startStubX, paintInfo.startStubY ],
            current = [ paintInfo.startStubX, paintInfo.startStubY ],
            // perhaps adjust wavelength if acting as a rudimentary spring
            w = this.spring ? d <= this.compressedThreshold ? 1 : d / 20 : this.wavelength,
            peaks = Math.round(d / w),
            shift = d - (peaks * w),
            upper = true;

        // start point to start stub
        this._addSegment(StraightSegment, {
            x1:paintInfo.sx,
            y1:paintInfo.sy,
            x2:paintInfo.startStubX,
            y2:paintInfo.startStubY
        });

        for (let i = 0; i < peaks - 1; i++) {
            let xy = pointOnLine(origin, m, shift + ((i+1) * w)),
                pxy = translatePoint(xy, n, upper, this.amplitude);

            this._addSegment(StraightSegment, {
                x1:current[0],
                y1:current[1],
                x2:pxy[0],
                y2:pxy[1]
            });
            upper = !upper;
            current = pxy;
        }

        // segment to end stub
        this._addSegment(StraightSegment, {
            x1:current[0],
            y1:current[1],
            x2:paintInfo.endStubX,
            y2:paintInfo.endStubY
        });

        // end stub to end point
        this._addSegment(StraightSegment, {
            x1:paintInfo.endStubX,
            y1:paintInfo.endStubY,
            x2:paintInfo.tx,
            y2:paintInfo.ty
        });
    }
}

Connectors.register(TriangleWaveConnector.type, TriangleWaveConnector)
