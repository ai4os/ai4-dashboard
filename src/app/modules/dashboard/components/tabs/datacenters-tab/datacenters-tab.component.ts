import { Component, Input, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import OsmSource from 'ol/source/OSM';
import { transform } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import { Feature, Overlay } from 'ol';
import { Point, SimpleGeometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { DatacenterStats } from '@app/shared/interfaces/stats.interface';
import { Coordinate } from 'ol/coordinate';

@Component({
    selector: 'app-datacenters-tab',
    templateUrl: './datacenters-tab.component.html',
    styleUrls: ['./datacenters-tab.component.scss'],
})
export class DatacentersTabComponent implements OnInit {
    constructor() {
        this.tileLayer.setSource(this.tileSource.source);
    }

    @Input() datacentersStats: DatacenterStats[] = [];

    private map!: Map;
    private tileLayer: TileLayer<OsmSource> = new TileLayer();
    private tileSource = { name: 'OSM', source: new OsmSource() };
    private vectorLayer: VectorLayer<any> = new VectorLayer<any>();

    ngOnInit(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);

        // markers
        const markers = this.getMarkers();
        this.vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: markers,
            }),
            style: {
                'circle-radius': 5,
                'circle-fill-color': rs.getPropertyValue('--primary'),
            },
        });

        // popup
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const overlay = new Overlay({
            element: container!,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });

        // map
        this.map = new Map({
            interactions: defaultInteractions().extend([new PinchZoom()]),
            layers: [this.tileLayer, this.vectorLayer],
            overlays: [overlay],
            view: new View({
                constrainResolution: true,
                center: transform([9, 53], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4,
            }),
            controls: defaultControls().extend([
                new Attribution(),
                new FullScreen(),
            ]),
        });

        // show dc info popup
        this.map.on('click', (evt) => {
            const feature = this.map.getFeaturesAtPixel(evt.pixel)[0];
            if (feature) {
                const geometry = feature.getGeometry();
                if (geometry instanceof SimpleGeometry) {
                    const coordinate = geometry.getCoordinates();
                    if (coordinate) {
                        coordinate.map(Number);
                        const datacenter = this.getDatacenter(coordinate);
                        content!.innerHTML =
                            '<p><b>Datacenter:</b> ' +
                            datacenter.name +
                            '</p><p><b>PUE:</b> ' +
                            datacenter.PUE +
                            '</p><p><b>Energy quality:</b> ' +
                            datacenter.energy_quality +
                            '</p>';
                        overlay.setPosition(coordinate);
                    }
                }
            } else {
                overlay.setPosition(undefined);
            }
        });

        this.updateSize();
    }

    updateSize(target = 'map'): void {
        this.map.setTarget(target);
        this.map.updateSize();
    }

    getDatacenter(coords: Coordinate): DatacenterStats {
        let datacenter: DatacenterStats = {
            name: 'Unknown',
            lat: 0,
            lon: 0,
            PUE: 0,
            energy_quality: 0,
            nodes: [],
        };

        for (const dc in this.datacentersStats) {
            const dc_coords = transform(
                [this.datacentersStats[dc].lon, this.datacentersStats[dc].lat],
                'EPSG:4326',
                'EPSG:3857'
            );
            if (dc_coords[0] === coords[0] && dc_coords[1] === coords[1]) {
                datacenter = this.datacentersStats[dc];
            }
        }
        return datacenter;
    }

    getMarkers(): Feature[] {
        const features = [];
        for (const dc in this.datacentersStats) {
            const point = new Point(
                transform(
                    [
                        this.datacentersStats[dc].lon,
                        this.datacentersStats[dc].lat,
                    ],
                    'EPSG:4326',
                    'EPSG:3857'
                )
            );
            features.push(new Feature(point));
        }
        return features;
    }
}
