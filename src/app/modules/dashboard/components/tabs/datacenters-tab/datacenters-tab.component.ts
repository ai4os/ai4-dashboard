import { AfterViewInit, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import OsmSource from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector } from 'ol/source';
import VectorSource from 'ol/source/Vector';

@Component({
    selector: 'app-datacenters-tab',
    templateUrl: './datacenters-tab.component.html',
    styleUrls: ['./datacenters-tab.component.scss'],
})
export class DatacentersTabComponent implements OnInit, AfterViewInit {
    constructor() {
        this.tileLayer.setSource(this.tileSource.source);
        this.vectorLayer.setSource(this.markerSource);
    }

    private map!: Map;
    private tileLayer: TileLayer<OsmSource> = new TileLayer();
    private tileSource = { name: 'OSM', source: new OsmSource() };

    private vectorLayer: VectorLayer<any> = new VectorLayer<any>();
    private markerSource = new Vector();

    ngOnInit(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);

        const point = new Point(
            transform(
                [-3.8022381778169154, 43.47159782340522],
                'EPSG:4326',
                'EPSG:3857'
            )
        );
        this.vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [new Feature(point)],
            }),
            style: {
                'circle-radius': 5,
                'circle-fill-color': rs.getPropertyValue('--primary'),
            },
        });

        this.map = new Map({
            interactions: defaultInteractions().extend([new PinchZoom()]),
            layers: [this.tileLayer, this.vectorLayer],
            view: new View({
                constrainResolution: true,
            }),
            controls: defaultControls().extend([
                new Attribution(),
                new FullScreen(),
            ]),
        });

        let iconFeature = new Feature({
            geometry: new Point(
                transform(
                    [-3.8022381778169154, 43.47159782340522],
                    'EPSG:4326',
                    'EPSG:3857'
                )
            ),
            name: 'Null Island',
            population: 10000,
            rainfall: 500,
        });

        this.markerSource.addFeature(iconFeature);
    }

    ngAfterViewInit(): void {
        this.updateView();
        this.updateSize();
    }

    /**
     * Updates zoom and center of the view.
     * @param zoom Zoom.
     * @param center Center in long/lat.
     */
    updateView(zoom = 2, center: [number, number] = [0, 0]): void {
        this.map.getView().setZoom(zoom);
        this.map.getView().setCenter(fromLonLat(center));
    }

    /**
     * Updates target and size of the map.
     * @param target HTML container.
     */
    updateSize(target = 'map'): void {
        this.map.setTarget(target);
        this.map.updateSize();
    }
}
