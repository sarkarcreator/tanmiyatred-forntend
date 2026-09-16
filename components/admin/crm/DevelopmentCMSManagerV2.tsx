'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Building2,
  Layers3,
  Clock3,
  Newspaper,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Save,
  X,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import type { ProjectItem, UnitItem, TimelineItem, NewsItem } from '@/types';

type Props = {
  projects: ProjectItem[];
  units: UnitItem[];
  timeline: TimelineItem[];
  news: NewsItem[];
  onRefresh?: () => Promise<void>;
};

type Section = 'PROJECTS' | 'UNITS' | 'TIMELINE' | 'NEWS' | 'USERS';
type Kind = 'project' | 'unit' | 'timeline' | 'news';

type AnyRecord = Record<string, any>;

const input =
  'w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]';
const card = 'bg-[#171715] border border-[#25221E]';
const btn =
  'inline-flex items-center gap-1.5 px-4 py-2 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold';

const projectBlank = (): AnyRecord => ({
  title: '',
  titleAr: '',
  category: 'RESIDENTIAL',
  status: 'UPCOMING',
  location: 'Dubai, UAE',
  locationAr: 'دبي، الإمارات العربية المتحدة',
  tagline: '',
  taglineAr: '',
  overview: '',
  overviewAr: '',
  architecture: '',
  architectureAr: '',
  heroImage: '',
  startingPrice: '',
  completionDate: '',
  isFeatured: false,
  order: 0,
  amenities: [],
  gallery: [],
  documents: [],
  currency: 'AED',
});

const unitBlank = (): AnyRecord => ({
  projectId: '',
  unitNumber: '',
  type: 'APARTMENT',
  bedrooms: 0,
  bathrooms: 0,
  areaSqFt: 0,
  floor: '',
  price: 0,
  currency: 'AED',
  status: 'AVAILABLE',
  floorPlanUrl: '',
  images: [],
});

const newsBlank = (): AnyRecord => ({
  title: '',
  titleAr: '',
  slug: '',
  excerpt: '',
  excerptAr: '',
  content: '',
  contentAr: '',
  featuredImage: '',
  author: 'Tanmiyat Editorial',
  category: 'Insights',
  publishedDate: new Date().toISOString(),
  isPublished: false,
  seoTitle: '',
  seoDescription: '',
});

export const DevelopmentCMSManagerV2: React.FC<Props> = ({
  projects: initialProjects,
  units: initialUnits,
  timeline: initialTimeline,
  news: initialNews,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [units, setUnits] = useState<UnitItem[]>(initialUnits);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [section, setSection] = useState<Section>('PROJECTS');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<AnyRecord | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const busyRef = useRef(false);

  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project.title])),
    [projects],
  );

  const normalizedSearch = search.toLowerCase();
  const list =
    section === 'PROJECTS'
      ? projects.filter((project) =>
          `${project.title} ${project.location} ${project.category}`
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : section === 'UNITS'
        ? units.filter((unit) =>
            `${unit.unitNumber} ${projectMap.get(unit.projectId) || ''} ${unit.type}`
              .toLowerCase()
              .includes(normalizedSearch),
          )
        : section === 'TIMELINE'
          ? timeline.filter((item) =>
              `${item.year} ${item.title} ${item.description}`
                .toLowerCase()
                .includes(normalizedSearch),
            )
          : news.filter((item) =>
              `${item.title} ${item.category} ${item.author}`
                .toLowerCase()
                .includes(normalizedSearch),
            );

  const api = async (url: string, method = 'GET', body?: unknown) => {
    const response = await fetch(url, {
      method,
      credentials: 'include',
      cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || `Request failed (${response.status})`);
    }
    return payload.data;
  };

  const save = async () => {
    if (!editing || !kind || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setNotice('');

    try {
      if (kind === 'project') {
        const body = {
          ...editing,
          startingPrice:
            editing.startingPrice === '' ? undefined : Number(editing.startingPrice),
          order: Number(editing.order || 0),
        };
        const data = editing.id
          ? await api(`/api/projects/${editing.id}`, 'PATCH', body)
          : await api('/api/projects', 'POST', {
              ...body,
              slug:
                (editing.slug || editing.title)
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '') +
                '-' +
                Date.now().toString().slice(-6),
            });

        if (data) {
          const saved = data as ProjectItem;
          setProjects((previous) =>
            editing.id
              ? previous.map((project) =>
                  project.id === saved.id ? saved : project,
                )
              : [saved, ...previous],
          );
        }
      } else if (kind === 'unit') {
        const body = {
          ...editing,
          bedrooms: Number(editing.bedrooms),
          bathrooms: Number(editing.bathrooms),
          areaSqFt: Number(editing.areaSqFt),
          price: Number(editing.price),
          floor:
            editing.floor === '' ? undefined : Number(editing.floor),
        };
        const data = await api(
          editing.id ? `/api/units/${editing.id}` : '/api/units',
          editing.id ? 'PATCH' : 'POST',
          body,
        );

        if (data) {
          const saved = data as UnitItem;
          setUnits((previous) =>
            editing.id
              ? previous.map((unit) => (unit.id === saved.id ? saved : unit))
              : [saved, ...previous],
          );
        }
      } else if (kind === 'timeline') {
        if (!editing.id) {
          throw new Error('Timeline creation requires a saved entry ID.');
        }
        const data = await api(`/api/timeline/${editing.id}`, 'PATCH', editing);
        if (data) {
          const saved = data as TimelineItem;
          setTimeline((previous) =>
            previous.map((item) => (item.id === saved.id ? saved : item)),
          );
        }
      } else {
        const body = {
          ...editing,
          slug:
            (editing.slug || editing.title)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '') || `article-${Date.now()}`,
          publishedDate: editing.publishedDate || new Date().toISOString(),
          seoTitle: editing.seoTitle || editing.title,
          seoDescription: editing.seoDescription || editing.excerpt,
        };
        const data = await api(
          editing.id ? `/api/news/${editing.id}` : '/api/news',
          editing.id ? 'PATCH' : 'POST',
          body,
        );

        if (data) {
          const saved = data as NewsItem;
          setNews((previous) =>
            editing.id
              ? previous.map((item) =>
                  item.id === saved.id ? saved : item,
                )
              : [saved, ...previous],
          );
        }
      }

      setEditing(null);
      setKind(null);
      setNotice('Changes saved successfully.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const remove = async (recordKind: Kind, id: string) => {
    if (busyRef.current) return;
    if (!window.confirm(`Are you sure you want to delete/archive this ${recordKind}?`)) {
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setNotice('');

    try {
      const url =
        recordKind === 'project'
          ? `/api/projects/${id}`
          : recordKind === 'unit'
            ? `/api/units/${id}`
            : recordKind === 'timeline'
              ? `/api/timeline/${id}`
              : `/api/news/${id}`;

      await api(url, 'DELETE');

      if (recordKind === 'project') {
        setProjects((previous) => previous.filter((project) => project.id !== id));
      } else if (recordKind === 'unit') {
        setUnits((previous) => previous.filter((unit) => unit.id !== id));
      } else if (recordKind === 'timeline') {
        setTimeline((previous) => previous.filter((item) => item.id !== id));
      } else {
        setNews((previous) => previous.filter((item) => item.id !== id));
      }

      setNotice(`${recordKind} removed successfully.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Delete failed.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const begin = (recordKind: Kind, value: AnyRecord) => {
    if (busyRef.current) return;
    setKind(recordKind);
    setEditing(value);
  };

  const tabs: Array<[Section, string, React.ElementType, number]> = [
    ['PROJECTS', 'Master Projects', Building2, projects.length],
    ['UNITS', 'Inventory Units', Layers3, units.length],
    ['TIMELINE', 'Heritage Timeline', Clock3, timeline.length],
    ['NEWS', 'News & Insights', Newspaper, news.length],
    ['USERS', 'Roles & Access', ShieldCheck, 1],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl text-[#F5F2EB]">Development &amp; CMS</h1>
          <p className="text-xs text-[#8C867E] mt-1">
            Professional development content, inventory and publishing administration.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#7A756D]" />
          <input
            className={`${input} pl-9`}
            placeholder="Search this section..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {tabs.map(([id, label, Icon, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSection(id);
              setSearch('');
            }}
            className={`${card} p-3 text-left ${section === id ? 'border-[#B79A62] bg-[#1C1A17]' : ''}`}
          >
            <Icon className="w-5 h-5 text-[#B79A62] mb-2" />
            <div className="text-[10px] uppercase tracking-wider text-[#C8C0B3]">{label}</div>
            <div className="text-xl text-[#F5F2EB]">{count}</div>
          </button>
        ))}
      </div>

      {notice && (
        <div className="border border-[#403B33] bg-[#121210] px-4 py-3 text-xs text-[#D8BE8A]">
          {notice}
        </div>
      )}

      {section === 'PROJECTS' && (
        <Panel
          title="Master Projects"
          action={
            <button className={btn} type="button" onClick={() => begin('project', projectBlank())}>
              <Plus className="w-4 h-4" />
              New Project
            </button>
          }
        >
          <div className="grid md:grid-cols-2 gap-4">
            {list.map((project: any) => (
              <Card
                key={project.id}
                title={project.title}
                meta={`${project.category} • ${project.status}`}
                detail={project.location}
                image={project.heroImage}
                footer={`${project.gallery?.length || 0} gallery • ${project.documents?.length || 0} documents • ${project.amenities?.length || 0} amenities`}
                edit={() =>
                  begin('project', {
                    ...project,
                    startingPrice: project.startingPrice ?? '',
                    completionDate: project.completionDate ?? '',
                  })
                }
                del={() => remove('project', project.id)}
              />
            ))}
          </div>
          {!list.length && <Empty />}
        </Panel>
      )}

      {section === 'UNITS' && (
        <Panel
          title="Inventory Units"
          action={
            <button className={btn} type="button" onClick={() => begin('unit', unitBlank())}>
              <Plus className="w-4 h-4" />
              New Unit
            </button>
          }
        >
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-xs">
              <thead className="bg-[#0A0A09] text-[#7A756D]">
                <tr>
                  {['Unit', 'Project', 'Type', 'Beds', 'Area', 'Price', 'Actions'].map((label) => (
                    <th key={label} className="p-3 text-left">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22201C]">
                {list.map((unit: any) => (
                  <tr key={unit.id}>
                    <td className="p-3 text-[#F5F2EB]">{unit.unitNumber}</td>
                    <td className="p-3">{projectMap.get(unit.projectId) || 'Unlinked'}</td>
                    <td className="p-3">{unit.type}</td>
                    <td className="p-3">{unit.bedrooms}</td>
                    <td className="p-3">{Number(unit.areaSqFt).toLocaleString()} sq ft</td>
                    <td className="p-3">AED {Number(unit.price).toLocaleString()}</td>
                    <td className="p-3">
                      <Actions
                        edit={() => begin('unit', { ...unit })}
                        del={() => remove('unit', unit.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!list.length && <Empty />}
          </div>
        </Panel>
      )}

      {section === 'TIMELINE' && (
        <Panel
          title="Heritage Timeline"
          action={
            <button
              className={btn}
              type="button"
              onClick={() =>
                setNotice(
                  'Timeline creation is intentionally disabled until a repository-backed create method is added; existing entries remain fully editable/deletable.',
                )
              }
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          }
        >
          <div className="space-y-3">
            {list.map((item: any) => (
              <div key={item.id} className={`${card} p-5 flex gap-4 items-start`}>
                <div className="text-2xl text-[#B79A62] font-editorial w-20">{item.year}</div>
                <div className="flex-1">
                  <h3 className="text-[#F5F2EB]">{item.title}</h3>
                  <p className="text-xs text-[#8C867E] mt-1">{item.description}</p>
                  <Actions
                    edit={() => begin('timeline', { ...item })}
                    del={() => remove('timeline', item.id)}
                  />
                </div>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="w-24 h-20 object-cover" />
                )}
              </div>
            ))}
          </div>
          {!list.length && <Empty />}
        </Panel>
      )}

      {section === 'NEWS' && (
        <Panel
          title="News & Insights"
          action={
            <button className={btn} type="button" onClick={() => begin('news', newsBlank())}>
              <Plus className="w-4 h-4" />
              New Article
            </button>
          }
        >
          <div className="grid md:grid-cols-2 gap-4">
            {list.map((item: any) => (
              <Card
                key={item.id}
                title={item.title}
                meta={`${item.category} • ${item.isPublished ? 'PUBLISHED' : 'DRAFT'}`}
                detail={item.excerpt}
                image={item.featuredImage}
                edit={() => begin('news', { ...item })}
                del={() => remove('news', item.id)}
              />
            ))}
          </div>
          {!list.length && <Empty />}
        </Panel>
      )}

      {section === 'USERS' && (
        <Panel title="Roles & Access">
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#B79A62]" />
              <div>
                <div className="text-[#F5F2EB] font-semibold">SUPER_ADMIN</div>
                <div className="text-xs text-[#8C867E]">Current executive account</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-5">
              {[
                'SUPER_ADMIN',
                'ADMIN',
                'SALES_MANAGER',
                'AGENT',
                'MARKETING',
                'CRM_MANAGER',
                'ACCOUNTANT',
                'VIEWER',
                'EDITOR',
                'SALES',
              ].map((role) => (
                <div
                  key={role}
                  className="border border-[#25221E] bg-[#0A0A09] px-3 py-2 text-[10px] text-[#C8C0B3]"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {editing && (
        <Editor
          title={`${editing.id ? 'Edit ' : 'Create '}${kind}`}
          close={() => {
            setEditing(null);
            setKind(null);
          }}
          save={save}
          busy={busy}
        >
          {kind === 'project' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ['Title', 'title'],
                  ['Arabic Title', 'titleAr'],
                  ['Location', 'location'],
                  ['Arabic Location', 'locationAr'],
                  ['Tagline', 'tagline'],
                  ['Arabic Tagline', 'taglineAr'],
                  ['Starting Price', 'startingPrice'],
                  ['Completion Date', 'completionDate'],
                ].map(([label, key]) => (
                  <Field
                    key={key}
                    label={label}
                    value={editing[key] ?? ''}
                    onChange={(value) => setEditing({ ...editing, [key]: value })}
                  />
                ))}
              </div>
              <Text
                label="Overview"
                value={editing.overview}
                onChange={(value) => setEditing({ ...editing, overview: value })}
              />
              <Text
                label="Architecture"
                value={editing.architecture}
                onChange={(value) => setEditing({ ...editing, architecture: value })}
              />
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <UploadField
                  label="Upload hero image"
                  accept="image/*"
                  onDone={(url) => setEditing({ ...editing, heroImage: url })}
                />
                <UploadField
                  label="Upload brochure / document"
                  accept="application/pdf,.doc,.docx"
                  onDone={(url) => setEditing({ ...editing, brochureUrl: url })}
                />
              </div>
              <div className="mt-4 p-4 border border-[#25221E]">
                <div className="text-[10px] uppercase text-[#B79A62] mb-3">Gallery</div>
                <UploadField
                  label="Upload gallery image"
                  accept="image/*"
                  onDone={(url) =>
                    setEditing({
                      ...editing,
                      gallery: [
                        ...(editing.gallery || []),
                        { id: `gallery-${Date.now()}`, imageUrl: url },
                      ],
                    })
                  }
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {(editing.gallery || []).map((galleryItem: any) => (
                    <div key={galleryItem.id} className="relative w-20 h-16">
                      <img
                        src={galleryItem.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            gallery: editing.gallery.filter(
                              (item: any) => item.id !== galleryItem.id,
                            ),
                          })
                        }
                        className="absolute -top-2 -right-2 rounded-full bg-black p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {kind === 'unit' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Project"
                  value={editing.projectId}
                  options={projects.map((project) => project.id)}
                  labels={projectMap}
                  onChange={(value) => setEditing({ ...editing, projectId: value })}
                />
                {[
                  ['Unit Number', 'unitNumber'],
                  ['Type', 'type'],
                  ['Bedrooms', 'bedrooms'],
                  ['Bathrooms', 'bathrooms'],
                  ['Area Sq Ft', 'areaSqFt'],
                  ['Floor', 'floor'],
                  ['Price AED', 'price'],
                ].map(([label, key]) => (
                  <Field
                    key={key}
                    label={label}
                    value={editing[key] ?? ''}
                    type={['bedrooms', 'bathrooms', 'areaSqFt', 'floor', 'price'].includes(key) ? 'number' : 'text'}
                    onChange={(value) => setEditing({ ...editing, [key]: value })}
                  />
                ))}
                <Select
                  label="Status"
                  value={editing.status}
                  options={['AVAILABLE', 'RESERVED', 'SOLD', 'BLOCKED']}
                  onChange={(value) => setEditing({ ...editing, status: value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <UploadField
                  label="Upload floor plan"
                  accept="image/*,application/pdf"
                  onDone={(url) => setEditing({ ...editing, floorPlanUrl: url })}
                />
                <UploadField
                  label="Upload unit image"
                  accept="image/*"
                  onDone={(url) =>
                    setEditing({
                      ...editing,
                      images: [...(editing.images || []), url],
                    })
                  }
                />
              </div>
            </>
          )}

          {kind === 'timeline' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Year"
                  value={editing.year}
                  type="number"
                  onChange={(value) => setEditing({ ...editing, year: Number(value) })}
                />
                <Field
                  label="Title"
                  value={editing.title}
                  onChange={(value) => setEditing({ ...editing, title: value })}
                />
                <Field
                  label="Arabic Title"
                  value={editing.titleAr}
                  onChange={(value) => setEditing({ ...editing, titleAr: value })}
                />
              </div>
              <Text
                label="Description"
                value={editing.description}
                onChange={(value) => setEditing({ ...editing, description: value })}
              />
              <Text
                label="Arabic Description"
                value={editing.descriptionAr}
                onChange={(value) => setEditing({ ...editing, descriptionAr: value })}
              />
              <UploadField
                label="Upload timeline image"
                accept="image/*"
                onDone={(url) => setEditing({ ...editing, imageUrl: url })}
              />
            </>
          )}

          {kind === 'news' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ['Title', 'title'],
                  ['Arabic Title', 'titleAr'],
                  ['Category', 'category'],
                  ['Author', 'author'],
                  ['SEO Title', 'seoTitle'],
                  ['SEO Description', 'seoDescription'],
                ].map(([label, key]) => (
                  <Field
                    key={key}
                    label={label}
                    value={editing[key] ?? ''}
                    onChange={(value) => setEditing({ ...editing, [key]: value })}
                  />
                ))}
              </div>
              <Text
                label="Excerpt"
                value={editing.excerpt}
                onChange={(value) => setEditing({ ...editing, excerpt: value })}
              />
              <Text
                label="Arabic Excerpt"
                value={editing.excerptAr}
                onChange={(value) => setEditing({ ...editing, excerptAr: value })}
              />
              <Text
                label="Content"
                value={editing.content}
                onChange={(value) => setEditing({ ...editing, content: value })}
              />
              <Text
                label="Arabic Content"
                value={editing.contentAr}
                onChange={(value) => setEditing({ ...editing, contentAr: value })}
              />
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <UploadField
                  label="Upload featured image"
                  accept="image/*"
                  onDone={(url) => setEditing({ ...editing, featuredImage: url })}
                />
                <label className="flex items-center gap-3 border border-[#25221E] px-3 py-2.5 text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.isPublished)}
                    onChange={(event) =>
                      setEditing({ ...editing, isPublished: event.target.checked })
                    }
                  />
                  Published
                </label>
              </div>
            </>
          )}
        </Editor>
      )}
    </div>
  );
};

const Panel = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="font-editorial text-2xl text-[#F5F2EB]">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const Empty = () => (
  <div className="p-8 text-center text-xs text-[#7A756D]">No records found.</div>
);

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: string;
}) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-wider text-[#8C867E] mb-1">
      {label}
    </span>
    <input
      className={input}
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

const Text = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
}) => (
  <label className="block mt-4">
    <span className="block text-[10px] uppercase tracking-wider text-[#8C867E] mb-1">
      {label}
    </span>
    <textarea
      rows={5}
      className={input}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

const Select = ({
  label,
  value,
  options,
  onChange,
  labels,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  labels?: Map<string, string>;
}) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-wider text-[#8C867E] mb-1">
      {label}
    </span>
    <select
      className={input}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labels?.get(option) || option}
        </option>
      ))}
    </select>
  </label>
);

const UploadField = ({
  label,
  onDone,
  accept,
}: {
  label: string;
  onDone: (url: string) => void;
  accept?: string;
}) => (
  <label className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-[#403B33] bg-[#0A0A09] text-xs text-[#C8C0B3] cursor-pointer">
    <Upload className="w-4 h-4 text-[#B79A62]" />
    {label}
    <input
      className="hidden"
      type="file"
      accept={accept}
      onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/uploads', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error(payload.error || 'Upload failed');
          }
          onDone(payload.data?.url || payload.data?.files?.[0]?.url || '');
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Upload failed');
        } finally {
          event.target.value = '';
        }
      }}
    />
  </label>
);

const Actions = ({
  edit,
  del,
}: {
  edit: () => void;
  del: () => void;
}) => (
  <div className="flex justify-end gap-1 mt-3">
    <button
      type="button"
      title="Edit"
      onClick={edit}
      className="p-2 border border-[#302D28] hover:text-[#B79A62]"
    >
      <Pencil className="w-4 h-4" />
    </button>
    <button
      type="button"
      title="Delete"
      onClick={del}
      className="p-2 border border-[#302D28] hover:text-red-400"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

const Card = ({
  title,
  meta,
  detail,
  image,
  footer,
  edit,
  del,
}: {
  title: string;
  meta: string;
  detail: string;
  image?: string;
  footer?: string;
  edit: () => void;
  del: () => void;
}) => (
  <div className={`${card} p-5`}>
    <div className="flex gap-4">
      <div className="w-24 h-20 shrink-0 bg-[#0A0A09] overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="m-auto mt-7 text-[#5E5A54]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg text-[#F5F2EB] truncate">{title}</h3>
        <p className="text-[10px] uppercase tracking-wider text-[#B79A62]">{meta}</p>
        <p className="text-xs text-[#8C867E] mt-2 line-clamp-3">{detail}</p>
      </div>
    </div>
    {footer && <div className="text-[10px] text-[#7A756D] mt-4">{footer}</div>}
    <Actions edit={edit} del={del} />
  </div>
);

const Editor = ({
  title,
  close,
  save,
  busy,
  children,
}: {
  title: string;
  close: () => void;
  save: () => void;
  busy: boolean;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 bg-black/75 p-4 sm:p-8 overflow-y-auto">
    <div className="max-w-4xl mx-auto bg-[#171715] border border-[#332F28] shadow-2xl">
      <div className="sticky top-0 z-10 bg-[#171715] border-b border-[#25221E] px-5 py-4 flex justify-between">
        <h2 className="font-editorial text-2xl text-[#F5F2EB]">{title}</h2>
        <button type="button" onClick={close} disabled={busy}>
          <X />
        </button>
      </div>
      <div className="p-5 sm:p-7">
        {children}
        <div className="flex justify-end gap-2 mt-7 pt-5 border-t border-[#25221E]">
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="px-4 py-2 border border-[#332F28] text-xs"
          >
            Cancel
          </button>
          <button type="button" onClick={save} disabled={busy} className={btn}>
            <Save className="w-4 h-4" />
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  </div>
);
