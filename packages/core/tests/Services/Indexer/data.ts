import { ILibrary, IProfile } from 'ipmc-interfaces';

export function createProfile(libraries: ILibrary[]): IProfile {
	return {
		id: 'a',
		libraries: libraries,
		name: 'test',
		type: 'internal',
	};
}

export const movieLibrary: ILibrary = {
	id: 'b',
	name: 'movies',
	type: 'movie',
	upstream: 'movies.sample',
};

export const seriesLibrary: ILibrary = {
	id: 'b',
	name: 'series',
	type: 'series',
	upstream: 'series.sample',
};

export const videoFile1 = new TextEncoder().encode(`<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT2S" type="static" mediaPresentationDuration="PT5569.146973S">
  <Period id="0">
    <AdaptationSet id="0" contentType="audio" lang="en" startWithSAP="1" segmentAlignment="true">
      <Representation id="0" bandwidth="387167" codecs="mp4a.40.2" mimeType="audio/mp4" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="6"/>
        <SegmentTemplate timescale="48000" initialization="audio/init.mp4" media="audio/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="1" contentType="video" width="1920" height="800" frameRate="24000/1001" segmentAlignment="true" par="12:5">
      <SupplementalProperty schemeIdUri="urn:mpeg:mpegB:cicp:TransferCharacteristics" value="1"/>
      <Representation id="1" bandwidth="9525158" codecs="avc1.640029" mimeType="video/mp4" sar="1:1">
        <SegmentTemplate timescale="24000" initialization="video/init.mp4" media="video/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="2" contentType="text" lang="en" segmentAlignment="true">
      <Role schemeIdUri="urn:mpeg:dash:role:2011" value="subtitle"/>
      <Representation id="2" bandwidth="832" codecs="wvtt" mimeType="application/mp4">
        <SegmentTemplate timescale="1000" initialization="subs/en/init.mp4" media="subs/en/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="0" d="6000" r="846"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
`) as Uint8Array<ArrayBuffer>;
export const videoFile2 = new TextEncoder().encode(`<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT2S" type="static" mediaPresentationDuration="PT5569.146973S">
  <Period id="0">
    <AdaptationSet id="0" contentType="audio" lang="en" startWithSAP="1" segmentAlignment="true">
      <Representation id="0" bandwidth="387167" codecs="mp4a.40.2" mimeType="audio/mp4" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="6"/>
        <SegmentTemplate timescale="48000" initialization="audio/init.mp4" media="audio/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="1" contentType="video" width="1920" height="800" frameRate="24000/1001" segmentAlignment="true" par="12:5">
      <SupplementalProperty schemeIdUri="urn:mpeg:mpegB:cicp:TransferCharacteristics" value="1"/>
      <Representation id="1" bandwidth="9525158" codecs="avc1.640029" mimeType="video/mp4" sar="1:1">
        <SegmentTemplate timescale="24000" initialization="video/init.mp4" media="video/$Number$.mp4" startNumber="1">
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
`) as Uint8Array<ArrayBuffer>;
