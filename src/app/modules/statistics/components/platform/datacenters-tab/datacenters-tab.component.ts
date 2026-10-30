import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    NgZone,
    inject,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import { transform, transformExtent } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import { Feature, Overlay } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { DatacenterStats } from '@app/shared/interfaces/stats.interface';
import { Coordinate } from 'ol/coordinate';
import {
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
} from '@angular/material/sidenav';
import { Cluster } from 'ol/source';
import { applyStyle } from 'ol-mapbox-style';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { createEmpty, extend } from 'ol/extent';
import { MetricColorService } from '@app/modules/statistics/services/metric-color/metric-color.service';
import {
    MapMetric,
    MapMetricSelectorComponent,
} from '../../common/map-metric-selector/map-metric-selector.component';
import { CountryFlagPipe } from '@app/modules/statistics/pipes/country-flag.pipe';
import { MapMetricLegendComponent } from '../../common/map-metric-legend/map-metric-legend.component';
import { ResourcesCardComponent } from '../../common/resources-card/resources-card.component';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CountryFlagPipe as CountryFlagPipe_1 } from '../../../pipes/country-flag.pipe';
import { StatsCardComponent } from '../../common/stats-card/stats-card.component';

@Component({
    selector: 'app-datacenters-tab',
    templateUrl: './datacenters-tab.component.html',
    styleUrls: ['./datacenters-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MapMetricLegendComponent,
        MapMetricSelectorComponent,
        MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        ResourcesCardComponent,
        MatIcon,
        TranslatePipe,
        CountryFlagPipe_1,
        StatsCardComponent,
    ],
})
export class DatacentersTabComponent implements OnInit, OnDestroy {
    private readonly metricColor = inject(MetricColorService);
    private readonly zone = inject(NgZone);
    private readonly cdr = inject(ChangeDetectorRef);

    constructor() {
        fetch('https://tiles.openfreemap.org/styles/positron')
            .then((res) => res.json())
            .then((style) => {
                style.layers = style.layers.filter((layer: any) => {
                    const id = layer.id || '';
                    const sourceLayer = layer['source-layer'] || '';

                    // Remove labels and text
                    if (layer.type === 'symbol') {
                        return false;
                    }

                    // Remove roads, bridges, tunnels, and transit
                    if (
                        id.includes('road') ||
                        id.includes('bridge') ||
                        id.includes('tunnel') ||
                        id.includes('railway') ||
                        id.includes('transit') ||
                        sourceLayer === 'transportation' ||
                        sourceLayer === 'transportation_name'
                    ) {
                        return false;
                    }

                    // Remove rivers, canals, and water labels
                    if (
                        id.includes('waterway') ||
                        sourceLayer === 'waterway' ||
                        sourceLayer === 'water_name'
                    ) {
                        return false;
                    }

                    // Keep only oceans and open seas in the water layer, excluding lakes and reservoirs
                    if (sourceLayer === 'water' || id.includes('water')) {
                        if (layer.filter) {
                            layer.filter = [
                                'all',
                                layer.filter,
                                [
                                    'in',
                                    ['get', 'class'],
                                    ['literal', ['ocean', 'sea']],
                                ],
                            ];
                        } else {
                            layer.filter = [
                                'in',
                                ['get', 'class'],
                                ['literal', ['ocean', 'sea']],
                            ];
                        }
                        return true;
                    }

                    // Remove mountains, terrain shading, forests, parks, and land cover
                    if (
                        id.includes('hillshade') ||
                        id.includes('contour') ||
                        id.includes('landuse') ||
                        id.includes('landcover') ||
                        id.includes('park') ||
                        id.includes('wood') ||
                        sourceLayer === 'landuse' ||
                        sourceLayer === 'landcover' ||
                        sourceLayer === 'park' ||
                        sourceLayer === 'natural' ||
                        layer.type === 'hillshade'
                    ) {
                        return false;
                    }

                    return true;
                });
                applyStyle(this.tileLayer, style, { updateSource: true });
            });
    }
    @Input() datacentersStats: DatacenterStats[] = [];
    @ViewChild('drawer')
    drawer!: MatDrawer;

    Math = Math;
    activeMetric: MapMetric = 'pue';
    selectedDatacenter: DatacenterStats | undefined;
    ramUnit = 'MiB';
    diskUnit = 'MiB';
    totalCpuNum = 0;
    usedCpuNum = 0;
    totalMemory = 0;
    usedMemory = 0;
    totalDisk = 0;
    usedDisk = 0;
    totalGpuNum = 0;
    usedGpuNum = 0;
    jobsNum = 0;

    private map!: Map;
    private readonly tileLayer = new VectorTileLayer({
        declutter: true,
    });
    private vectorLayer: VectorLayer<any> = new VectorLayer<any>();
    private readonly europeExtent = transformExtent(
        [-31, 27, 50, 72],
        'EPSG:4326',
        'EPSG:3857'
    );
    private readonly countryFlagPipe = new CountryFlagPipe();

    ngOnInit(): void {
        const r = document.querySelector(':root');

        // markers
        const markers = this.getMarkers();
        const clusterSource = new Cluster({
            distance: 50,
            source: new VectorSource({
                features: markers,
            }),
        });

        this.vectorLayer = new VectorLayer({
            source: clusterSource,
            style: (feature) => this.getMarkerStyle(feature),
        });

        // popup
        const container = document.getElementById('popup');
        const overlay = new Overlay({
            element: container!,
            positioning: 'bottom-center',
            offset: [0, -18],
            stopEvent: false,
        });
        const overlayWrapper = container!.parentElement;
        if (overlayWrapper) {
            overlayWrapper.style.pointerEvents = 'none';
            overlayWrapper.style.userSelect = 'none';
        }

        // map
        this.map = new Map({
            interactions: defaultInteractions().extend([new PinchZoom()]),
            layers: [this.tileLayer, this.vectorLayer],
            overlays: [overlay],
            moveTolerance: 6,
            view: new View({
                constrainResolution: true,
                extent: this.europeExtent,
                center: transform([9, 46], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4.5,
                maxZoom: 20,
            }),
            controls: defaultControls(),
        });

        // hover — show popup
        this.map.on('pointermove', (evt) => {
            if (evt.dragging) return;

            const members = this.getMembersAtPixel(evt.pixel);
            this.map.getViewport().style.cursor = members.length
                ? 'pointer'
                : '';

            if (members.length === 1) {
                const dc: DatacenterStats | undefined =
                    members[0].get('datacenter');
                const coordinate = (
                    members[0].getGeometry() as Point
                ).getCoordinates();
                if (dc) {
                    this.updatePopupContent(dc);
                    const current = overlay.getPosition();
                    if (
                        !current ||
                        current[0] !== coordinate[0] ||
                        current[1] !== coordinate[1]
                    ) {
                        overlay.setPosition(coordinate);
                    }
                    return;
                }
            }
            overlay.setPosition(undefined);
        });

        // click — open drawer or zoom in cluster
        this.map.on('click', (evt) => {
            const members = this.getMembersAtPixel(evt.pixel);

            if (members.length === 1) {
                const dc: DatacenterStats | undefined =
                    members[0].get('datacenter');
                if (dc) {
                    this.selectedDatacenter = dc;
                    this.loadDatacenterStats(dc);
                    overlay.setPosition(undefined);
                    this.drawer.open();
                }
            } else if (members.length > 1) {
                const extent = createEmpty();
                members.forEach((member) =>
                    extend(extent, member.getGeometry()!.getExtent())
                );
                this.map.getView().fit(extent, {
                    duration: 500,
                    maxZoom: 20,
                });
            } else {
                overlay.setPosition(undefined);
                this.drawer.close();
            }
            this.cdr.markForCheck();
        });

        this.updateSize();
        this.startPulseAnimation();
    }

    private pulseRadius = 10;
    private pulseGrowing = true;
    private animationFrame?: number;

    private startPulseAnimation(): void {
        let tick = 0;
        const animate = () => {
            if (tick++ % 2 === 0) {
                if (this.pulseGrowing) {
                    this.pulseRadius += 0.4;
                    if (this.pulseRadius >= 30) this.pulseGrowing = false;
                } else {
                    this.pulseRadius -= 0.4;
                    if (this.pulseRadius <= 10) this.pulseGrowing = true;
                }
                this.vectorLayer.changed();
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        this.zone.runOutsideAngular(() => {
            this.animationFrame = requestAnimationFrame(animate);
        });
    }

    private getMembersAtPixel(pixel: number[]): Feature[] {
        const cluster = this.map.forEachFeatureAtPixel(
            pixel,
            (feature) => feature as any,
            {
                layerFilter: (layer) => layer === this.vectorLayer,
                hitTolerance: 4,
            }
        );
        return cluster?.get('features') ?? [];
    }

    closeDrawer(): void {
        this.drawer.close();
    }

    private hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    private getMarkerStyle(feature: any): Style[] {
        const r = document.querySelector(':root')!;
        const rs = getComputedStyle(r);
        const size = feature.get('features').length;

        if (size > 1) {
            return [
                new Style({
                    image: new CircleStyle({
                        radius: 14,
                        stroke: new Stroke({
                            color: rs.getPropertyValue('--secondary'),
                        }),
                        fill: new Fill({
                            color: rs.getPropertyValue('--primary'),
                        }),
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: new Fill({ color: '#fff' }),
                        stroke: new Stroke({ color: '#fff' }),
                    }),
                }),
            ];
        }

        const dc = this.getDatacenterFromFeature(feature);
        const value = this.getMetricValue(dc, this.activeMetric);
        const color = this.metricColor.getColor(this.activeMetric, value);

        const haloOuter = new Style({
            image: new CircleStyle({
                radius: this.pulseRadius,
                fill: new Fill({ color: this.hexToRgba(color, 0.15) }),
            }),
        });

        const haloInner = new Style({
            image: new CircleStyle({
                radius: this.pulseRadius * 0.65,
                fill: new Fill({ color: this.hexToRgba(color, 0.25) }),
            }),
        });

        const dot = new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: 'white', width: 2.5 }),
            }),
        });

        return [haloOuter, haloInner, dot];
    }

    updateSize(target = 'map'): void {
        this.map.setTarget(target);
        this.map.updateSize();
    }

    setMemoryConfig() {
        if (this.totalMemory > 1000) {
            // use GiB
            this.ramUnit = 'GiB';
            this.usedMemory = this.usedMemory / Math.pow(2, 10);
            this.totalMemory = this.totalMemory / Math.pow(2, 10);
        }
    }

    setDiskConfig() {
        if (this.totalDisk > 1000) {
            // use GiB
            this.diskUnit = 'GiB';
            this.usedDisk = this.usedDisk / Math.pow(2, 10);
            this.totalDisk = this.totalDisk / Math.pow(2, 10);
        }
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
            const feature = new Feature(point);
            feature.set('datacenter', this.datacentersStats[dc]);
            features.push(feature);
        }
        return features;
    }

    private getMetricValue(
        dc: DatacenterStats | undefined,
        metric: MapMetric
    ): number | null {
        if (!dc) return null;

        const nodes = Object.values(dc.nodes);
        const jobsNum = nodes.reduce((acc, node) => acc + node.jobs_num, 0);

        const map: Record<MapMetric, number | null> = {
            pue: dc.PUE != null ? Number(dc.PUE) : null,
            jobs: jobsNum,
            co2: dc.energy_quality != null ? Number(dc.energy_quality) : null,
            water:
                dc.energy_water_usage != null
                    ? Number(dc.energy_water_usage)
                    : null,
            'environmental-score':
                dc.green_score != null ? Number(dc.green_score) : null,
        };
        return map[metric];
    }

    private getDatacenterFromFeature(
        clusterFeature: any
    ): DatacenterStats | undefined {
        return clusterFeature.get('features')?.[0]?.get('datacenter');
    }

    getDatacenter(coords: Coordinate): DatacenterStats {
        let datacenter: DatacenterStats = {
            name: 'Unknown',
            lat: 0,
            lon: 0,
            PUE: 0,
            energy_quality: 0,
            energy_water_usage: 0,
            green_score: 0,
            nodes: [],
            affinity: 0,
            country: '',
            footprints: {
                carbon: [],
                water: [],
                'environmental-score': [],
            },
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

    loadDatacenterStats(datacenter: DatacenterStats) {
        this.totalCpuNum = 0;
        this.usedCpuNum = 0;
        this.totalMemory = 0;
        this.usedMemory = 0;
        this.totalDisk = 0;
        this.usedDisk = 0;
        this.totalGpuNum = 0;
        this.usedGpuNum = 0;
        this.jobsNum = 0;

        for (const node in datacenter.nodes) {
            this.totalCpuNum += datacenter.nodes[node].cpu_total;
            this.usedCpuNum += datacenter.nodes[node].cpu_used;
            this.totalMemory += datacenter.nodes[node].ram_total;
            this.usedMemory += datacenter.nodes[node].ram_used;
            this.totalDisk += datacenter.nodes[node].disk_total;
            this.usedDisk += datacenter.nodes[node].disk_used;
            this.totalGpuNum += datacenter.nodes[node].gpu_total;
            this.usedGpuNum += datacenter.nodes[node].gpu_used;
            this.jobsNum += datacenter.nodes[node].jobs_num;
        }

        this.setMemoryConfig();
        this.setDiskConfig();
    }

    onMetricChange(metric: MapMetric): void {
        this.activeMetric = metric;
        this.vectorLayer.getSource()?.changed();
    }

    private readonly METRIC_CONFIG: Record<
        MapMetric,
        { label: string; unit: string }
    > = {
        pue: { label: 'PUE', unit: '' },
        jobs: { label: 'Jobs', unit: 'running' },
        co2: { label: 'CO₂', unit: 'g/kWh' },
        water: { label: 'Water', unit: 'l/kWh' },
        'environmental-score': { label: 'Green Score', unit: '' },
    };

    private updatePopupContent(dc: DatacenterStats): void {
        const value = this.getMetricValue(dc, this.activeMetric);
        const color = this.metricColor.getColor(this.activeMetric, value);
        const config = this.METRIC_CONFIG[this.activeMetric];

        const displayed =
            value == null
                ? '—'
                : this.activeMetric === 'jobs'
                  ? Math.trunc(value).toString()
                  : value.toFixed(2);

        document.getElementById('popup-name')!.textContent = dc.name;
        document.getElementById('popup-flag')!.textContent =
            this.countryFlagPipe.transform(dc.country);
        document.getElementById('popup-metric-dot')!.style.background = color;
        document.getElementById('popup-metric-label')!.textContent =
            config.label;
        document.getElementById('popup-metric-value')!.textContent = displayed;
        document.getElementById('popup-metric-unit')!.textContent = config.unit;
    }

    ngOnDestroy(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.map?.setTarget(undefined);
    }
}
