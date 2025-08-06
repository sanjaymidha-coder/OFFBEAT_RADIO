import { FC } from 'react';
import { ArtistTrackData } from '@/utils/artistTrackUtils';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import { Switch } from '@headlessui/react';

interface Props {
  value: ArtistTrackData;
  onChange: (data: ArtistTrackData) => void;
  disabled?: boolean;
}

const ArtistTrackFieldsForm: FC<Props> = ({ value, onChange, disabled }) => {
  // Direct field updaters (no debounce)
  const update = (field: keyof ArtistTrackData, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <div className="space-y-6">
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Track Information
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="artist-name">Artist Name *</Label>
          <Input
            id="artist-name"
            name="artist-name"
            disabled={disabled}
            value={value.artistName}
            onChange={e => update('artistName', e.currentTarget.value)}
            className="mt-1"
            placeholder="Enter artist name..."
          />
        </div>
        <div>
          <Label htmlFor="track-title">Track Title *</Label>
          <Input
            id="track-title"
            name="track-title"
            disabled={disabled}
            value={value.trackTitle}
            onChange={e => update('trackTitle', e.currentTarget.value)}
            className="mt-1"
            placeholder="Enter track title..."
          />
        </div>
        <div>
          <Label htmlFor="album-name">Album Name</Label>
          <Input
            id="album-name"
            name="album-name"
            disabled={disabled}
            value={value.albumName}
            onChange={e => update('albumName', e.currentTarget.value)}
            className="mt-1"
            placeholder="Enter album name..."
          />
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <h4 className="text-md font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Track File Upload
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="track-file-url">Track File URL</Label>
          <Input
            id="track-file-url"
            name="track-file-url"
            disabled={disabled}
            value={value.trackFileUrl}
            onChange={e => update('trackFileUrl', e.currentTarget.value)}
            className="mt-1"
            placeholder="https://example.com/track.mp3"
            type="url"
          />
        </div>
        <div>
          <Label htmlFor="track-file-name">Track File Name</Label>
          <Input
            id="track-file-name"
            name="track-file-name"
            disabled={disabled}
            value={value.trackFileName}
            onChange={e => update('trackFileName', e.currentTarget.value)}
            className="mt-1"
            placeholder="track-name.mp3"
          />
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <h4 className="text-md font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Music Industry Information
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="isrc">ISRC (International Standard Recording Code)</Label>
          <Input
            id="isrc"
            name="isrc"
            disabled={disabled}
            value={value.isrc}
            onChange={e => update('isrc', e.currentTarget.value)}
            className="mt-1"
            placeholder="US-ABC-12-34567"
          />
        </div>
        <div>
          <Label htmlFor="pro-affiliation">PRO Affiliation</Label>
          <select
            id="pro-affiliation"
            name="pro-affiliation"
            disabled={disabled}
            value={value.proAffiliation}
            onChange={e => update('proAffiliation', e.currentTarget.value)}
            className="mt-1 block w-full rounded-lg border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="">Select PRO</option>
            <option value="ASCAP">ASCAP</option>
            <option value="BMI">BMI</option>
            <option value="SESAC">SESAC</option>
            <option value="GMR">GMR</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="sound-exchange-registered">SoundExchange Registration</Label>
          <Switch
            checked={!!value.soundExchangeRegistered}
            onChange={checked => update('soundExchangeRegistered', checked)}
            disabled={disabled}
            className={`${value.soundExchangeRegistered ? 'bg-primary-700' : 'bg-gray-700'} relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            name="sound-exchange-registered"
            id="sound-exchange-registered"
          >
            <span className="sr-only">SoundExchange Registration</span>
            <span
              aria-hidden="true"
              className={`$${
                value.soundExchangeRegistered
                  ? 'translate-x-9 rtl:-translate-x-9'
                  : 'translate-x-0'
              } pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="text-sm text-neutral-500">
            {value.soundExchangeRegistered ? 'Registered' : 'Not Registered'}
          </span>
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <h4 className="text-md font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Channel/Playlist Selection
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target-channel">Target Channel</Label>
          <Input
            id="target-channel"
            name="target-channel"
            disabled={disabled}
            value={value.targetChannel}
            onChange={e => update('targetChannel', e.currentTarget.value)}
            className="mt-1"
            placeholder="Enter target channel..."
          />
        </div>
        <div>
          <Label htmlFor="target-playlist">Target Playlist</Label>
          <Input
            id="target-playlist"
            name="target-playlist"
            disabled={disabled}
            value={value.targetPlaylist}
            onChange={e => update('targetPlaylist', e.currentTarget.value)}
            className="mt-1"
            placeholder="Enter target playlist..."
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistTrackFieldsForm; 