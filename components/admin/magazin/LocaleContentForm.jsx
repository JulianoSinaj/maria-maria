"use client";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowDown, Trash, Plus } from "@/components/admin/AdminIcons";
import { useAdminI18n } from "@/components/admin/i18n/AdminI18n";
import {
  blankSection,
  blankPairingItem,
  blankFaqItem,
  blankMedia,
  blankList,
  LIMITS,
  PATH_IDS,
  slugify,
} from "@/lib/interviews/schema";
import {
  Field,
  TextInput,
  TextArea,
  ParagraphsArea,
  LinesArea,
  Select,
  Group,
  Toggle,
  ghostBtn,
  dangerBtn,
} from "./editorFields";
import ImageField from "./ImageField";

/* The per-language form — every field the article renders, in the order
   the reader meets it: masthead, SEO/byline, intro, chapters, pairing,
   serving, conclusion, FAQ, profile, wine band, closing paths, the two
   teasers. Chapters are a list of blocks (heading, paragraphs, optional
   quote, optional photo, optional list) so the layout stays the one
   InterviewArticle renders — no free-form HTML anywhere.

   `value` is one locale's content object; `onChange` receives the whole
   next object. `set(path, v)` clones and writes one key, the same idiom
   as the wine editor. */

const MEDIA_ASPECTS = [
  { value: "", key: "mediaAspectWide" },
  { value: "4/3", key: "mediaAspectNative" },
];

export default function LocaleContentForm({
  locale,
  value,
  onChange,
  options,
  onUploaded,
  resetKey,
  region,
  hasWine,
}) {
  const { t } = useAdminI18n();
  const reduced = useReducedMotion();
  const images = options?.images ?? [];
  const c = value;
  const f = (key) => t(`magazine.editor.fields.${key}`);
  const g = (key) => t(`magazine.editor.groups.${key}`);
  const a = (key, vars) => t(`magazine.editor.actions.${key}`, vars);

  const set = (path, v) => {
    const next = structuredClone(c);
    const keys = path.split(".");
    let cur = next;
    for (let i = 0; i < keys.length - 1; i += 1) {
      if (cur[keys[i]] == null || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys.at(-1)] = v;
    onChange(next);
  };

  const rk = `${resetKey}-${locale}`;

  /* ---- chapters ---- */
  const sections = c.sections ?? [];
  const setSections = (next) => set("sections", next);
  const updateSection = (i, patch) =>
    setSections(sections.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const moveSection = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next);
  };

  /* ---- pairing items / faq items ---- */
  const items = c.pairing?.items ?? [];
  const setItems = (next) => set("pairing.items", next);
  const faqItems = c.faq?.items ?? [];
  const setFaqItems = (next) => set("faq.items", next);

  return (
    <div className="space-y-4">
      {/* ================= masthead ================= */}
      <Group title={g("head")} hint={t("magazine.editor.groupHints.head")}>
        <Field label={f("name")} required>
          <TextInput value={c.name} onChange={(v) => set("name", v)} />
        </Field>
        <Field label={f("headline")} hint={t("magazine.editor.fieldHints.headline")} required>
          <TextArea rows={2} value={c.headline} onChange={(v) => set("headline", v)} />
        </Field>
        <Field label={f("deck")} hint={t("magazine.editor.fieldHints.deck")} required count={c.deck} max={LIMITS.deck}>
          <TextArea rows={3} value={c.deck} onChange={(v) => set("deck", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("eyebrow")} hint={t("magazine.editor.fieldHints.eyebrow")} required>
            <TextInput value={c.eyebrow} onChange={(v) => set("eyebrow", v)} />
          </Field>
          <Field label={f("badge")} hint={t("magazine.editor.fieldHints.badge")}>
            <TextInput value={c.badge} onChange={(v) => set("badge", v)} placeholder="Lugana DOC · Turbiana · Pozzolengo" />
          </Field>
        </div>
        <Field label={f("portraitAlt")} hint={t("magazine.editor.fieldHints.portraitAlt")} required>
          <TextInput value={c.portraitAlt} onChange={(v) => set("portraitAlt", v)} />
        </Field>
      </Group>

      {/* ================= SEO + byline ================= */}
      <Group title={g("seo")} hint={t("magazine.editor.groupHints.seo")} open={false}>
        <Field label={f("seoTitle")} hint={t("magazine.editor.fieldHints.seoTitle")} count={c.seo?.title} max={LIMITS.seoTitle}>
          <TextInput value={c.seo?.title} onChange={(v) => set("seo.title", v)} />
        </Field>
        <Field label={f("seoDescription")} count={c.seo?.description} max={LIMITS.seoDescription}>
          <TextArea rows={2} value={c.seo?.description} onChange={(v) => set("seo.description", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={f("bylineInterview")}>
            <TextInput value={c.byline?.interview} onChange={(v) => set("byline.interview", v)} />
          </Field>
          <Field label={f("bylineEditorial")}>
            <TextInput value={c.byline?.editorial} onChange={(v) => set("byline.editorial", v)} />
          </Field>
          <Field label={f("readingTime")} hint={t("magazine.editor.fieldHints.readingTime")}>
            <TextInput value={c.byline?.readingTime} onChange={(v) => set("byline.readingTime", v)} />
          </Field>
        </div>
      </Group>

      {/* ================= intro ================= */}
      <Group title={g("intro")} hint={t("magazine.editor.groupHints.intro")}>
        <Field label={f("intro")} hint={t("magazine.editor.fieldHints.paragraphs")} required>
          <ParagraphsArea value={c.intro} onChange={(v) => set("intro", v)} resetKey={rk} rows={6} />
        </Field>
      </Group>

      {/* ================= chapters ================= */}
      <Group
        title={g("sections")}
        hint={t("magazine.editor.groupHints.sections")}
        badge={sections.length ? String(sections.length) : null}
        actions={
          <button type="button" onClick={() => setSections([...sections, blankSection()])} className={ghostBtn}>
            <Plus className="h-3.5 w-3.5" />
            {a("addSection")}
          </button>
        }
      >
        {sections.length === 0 && (
          <p className="rounded-xl border border-dashed border-a-ink/15 px-4 py-5 text-center text-[12px] text-a-ink/45">
            {t("magazine.editor.noSections")}
          </p>
        )}
        <AnimatePresence initial={false}>
          {sections.map((s, i) => (
            <motion.div
              key={`${rk}-${i}`}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="rounded-2xl border border-a-ink/[0.08] bg-a-canvas/60 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/60">
                  {a("sectionN", { n: String(i + 1).padStart(2, "0") })}
                </span>
                <span className="truncate font-mono text-[10px] text-a-ink/35">
                  #{s.id || slugify(s.heading) || "…"}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label={a("moveUp")} title={a("moveUp")} className={`${ghostBtn} h-8 w-8 justify-center px-0`}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} aria-label={a("moveDown")} title={a("moveDown")} className={`${ghostBtn} h-8 w-8 justify-center px-0`}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setSections(sections.filter((_, j) => j !== i))} aria-label={a("removeSection")} title={a("removeSection")} className={`${dangerBtn} h-8 w-8 justify-center px-0`}>
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>

              <div className="space-y-4">
                <Field label={f("heading")} required>
                  <TextInput value={s.heading} onChange={(v) => updateSection(i, { heading: v })} />
                </Field>
                <Field label={f("paragraphs")} hint={t("magazine.editor.fieldHints.paragraphs")} required>
                  <ParagraphsArea value={s.paragraphs} onChange={(v) => updateSection(i, { paragraphs: v })} resetKey={rk} rows={7} />
                </Field>
                <Field label={f("quote")} hint={t("magazine.editor.fieldHints.quote")}>
                  <TextArea rows={2} value={s.quote} onChange={(v) => updateSection(i, { quote: v })} />
                </Field>
                <Field label={f("after")} hint={t("magazine.editor.fieldHints.after")}>
                  <ParagraphsArea value={s.after} onChange={(v) => updateSection(i, { after: v })} resetKey={rk} rows={2} />
                </Field>

                {/* optional photo */}
                <div className="rounded-xl border border-a-ink/[0.07] p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Toggle
                      on={!!s.media}
                      onChange={(on) => updateSection(i, { media: on ? blankMedia() : null })}
                      label={f("mediaToggle")}
                    />
                  </div>
                  {s.media && (
                    <div className="mt-4 space-y-4">
                      <ImageField
                        label={f("mediaSrc")}
                        value={s.media.src}
                        onChange={(src) => updateSection(i, { media: { ...s.media, src } })}
                        images={images}
                        onUploaded={onUploaded}
                        aspect="aspect-[16/9]"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label={f("mediaAlt")}>
                          <TextInput value={s.media.alt} onChange={(v) => updateSection(i, { media: { ...s.media, alt: v } })} />
                        </Field>
                        <Field label={f("mediaAspect")} hint={t("magazine.editor.fieldHints.mediaAspect")}>
                          <Select value={s.media.aspect} onChange={(v) => updateSection(i, { media: { ...s.media, aspect: v } })}>
                            {MEDIA_ASPECTS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {f(o.key)}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      </div>
                      <Field label={f("mediaCaption")}>
                        <TextInput value={s.media.caption} onChange={(v) => updateSection(i, { media: { ...s.media, caption: v } })} />
                      </Field>
                    </div>
                  )}
                </div>

                {/* optional list */}
                <div className="rounded-xl border border-a-ink/[0.07] p-3.5">
                  <Toggle
                    on={!!s.list}
                    onChange={(on) => updateSection(i, { list: on ? blankList() : null })}
                    label={f("listToggle")}
                  />
                  {s.list && (
                    <div className="mt-4 space-y-4">
                      <Field label={f("listLabel")}>
                        <TextInput value={s.list.label} onChange={(v) => updateSection(i, { list: { ...s.list, label: v } })} />
                      </Field>
                      <Field label={f("listItems")} hint={t("magazine.editor.fieldHints.lines")}>
                        <LinesArea value={s.list.items} onChange={(v) => updateSection(i, { list: { ...s.list, items: v } })} resetKey={rk} />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </Group>

      {/* ================= pairing ================= */}
      <Group
        title={g("pairing")}
        hint={t("magazine.editor.groupHints.pairing")}
        open={false}
        badge={items.length ? String(items.length) : null}
      >
        <Field label={f("pairingHeading")}>
          <TextInput value={c.pairing?.heading} onChange={(v) => set("pairing.heading", v)} />
        </Field>
        <Field label={f("paragraphs")} hint={t("magazine.editor.fieldHints.paragraphs")}>
          <ParagraphsArea value={c.pairing?.paragraphs} onChange={(v) => set("pairing.paragraphs", v)} resetKey={rk} rows={5} />
        </Field>
        <div className="rounded-xl border border-a-ink/[0.07] p-3.5">
          <Toggle
            on={!!c.pairing?.media}
            onChange={(on) => set("pairing.media", on ? blankMedia() : null)}
            label={f("mediaToggle")}
          />
          {c.pairing?.media && (
            <div className="mt-4 space-y-4">
              <ImageField
                label={f("mediaSrc")}
                value={c.pairing.media.src}
                onChange={(src) => set("pairing.media.src", src)}
                images={images}
                onUploaded={onUploaded}
                aspect="aspect-[16/9]"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={f("mediaAlt")}>
                  <TextInput value={c.pairing.media.alt} onChange={(v) => set("pairing.media.alt", v)} />
                </Field>
                <Field label={f("mediaAspect")} hint={t("magazine.editor.fieldHints.mediaAspect")}>
                  <Select value={c.pairing.media.aspect} onChange={(v) => set("pairing.media.aspect", v)}>
                    {MEDIA_ASPECTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {f(o.key)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label={f("mediaCaption")}>
                <TextInput value={c.pairing.media.caption} onChange={(v) => set("pairing.media.caption", v)} />
              </Field>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-a-ink/55">{f("pairingItems")}</span>
          <button type="button" onClick={() => setItems([...items, blankPairingItem()])} className={ghostBtn}>
            <Plus className="h-3.5 w-3.5" />
            {a("addItem")}
          </button>
        </div>
        {items.map((it, i) => (
          <div key={`${rk}-pi-${i}`} className="grid gap-3 rounded-xl border border-a-ink/[0.07] p-3 sm:grid-cols-[120px_1fr_1fr_auto]">
            <Field label={f("itemIcon")}>
              <Select value={it.icon} onChange={(v) => setItems(items.map((x, j) => (j === i ? { ...x, icon: v } : x)))}>
                {(options?.pairingIcons ?? []).map((k) => (
                  <option key={k} value={k}>
                    {t(`magazine.editor.icons.${k}`)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={f("itemTitle")}>
              <TextInput value={it.title} onChange={(v) => setItems(items.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
            </Field>
            <Field label={f("itemText")}>
              <TextInput value={it.text} onChange={(v) => setItems(items.map((x, j) => (j === i ? { ...x, text: v } : x)))} />
            </Field>
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label={a("removeItem")} title={a("removeItem")} className={`${dangerBtn} h-9 w-9 justify-center self-end px-0`}>
              <Trash className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </Group>

      {/* ================= serving ================= */}
      <Group
        title={g("serving")}
        hint={t("magazine.editor.groupHints.serving")}
        open={!!c.serving}
        actions={<Toggle on={!!c.serving} onChange={(on) => set("serving", on ? { heading: "", paragraphs: [] } : null)} />}
      >
        {c.serving ? (
          <>
            <Field label={f("heading")}>
              <TextInput value={c.serving.heading} onChange={(v) => set("serving.heading", v)} />
            </Field>
            <Field label={f("paragraphs")} hint={t("magazine.editor.fieldHints.paragraphs")}>
              <ParagraphsArea value={c.serving.paragraphs} onChange={(v) => set("serving.paragraphs", v)} resetKey={rk} rows={5} />
            </Field>
          </>
        ) : (
          <p className="text-[12px] text-a-ink/45">{t("magazine.editor.chapterOff")}</p>
        )}
      </Group>

      {/* ================= outro ================= */}
      <Group
        title={g("outro")}
        hint={t("magazine.editor.groupHints.outro")}
        open={!!c.outro}
        actions={<Toggle on={!!c.outro} onChange={(on) => set("outro", on ? { heading: "", paragraphs: [], quote: "" } : null)} />}
      >
        {c.outro ? (
          <>
            <Field label={f("heading")}>
              <TextInput value={c.outro.heading} onChange={(v) => set("outro.heading", v)} />
            </Field>
            <Field label={f("paragraphs")} hint={t("magazine.editor.fieldHints.paragraphs")}>
              <ParagraphsArea value={c.outro.paragraphs} onChange={(v) => set("outro.paragraphs", v)} resetKey={rk} rows={5} />
            </Field>
            <Field label={f("outroQuote")} hint={t("magazine.editor.fieldHints.quote")}>
              <TextArea rows={2} value={c.outro.quote} onChange={(v) => set("outro.quote", v)} />
            </Field>
          </>
        ) : (
          <p className="text-[12px] text-a-ink/45">{t("magazine.editor.chapterOff")}</p>
        )}
      </Group>

      {/* ================= FAQ ================= */}
      <Group
        title={g("faq")}
        hint={t("magazine.editor.groupHints.faq")}
        open={!!c.faq}
        badge={faqItems.length ? String(faqItems.length) : null}
        actions={
          <Toggle
            on={!!c.faq}
            onChange={(on) =>
              set("faq", on ? { eyebrow: "", title: "", titleAccent: "", description: "", items: [blankFaqItem()] } : null)
            }
          />
        }
      >
        {c.faq ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={f("faqEyebrow")}>
                <TextInput value={c.faq.eyebrow} onChange={(v) => set("faq.eyebrow", v)} />
              </Field>
              <Field label={f("faqTitle")}>
                <TextInput value={c.faq.title} onChange={(v) => set("faq.title", v)} />
              </Field>
              <Field label={f("faqTitleAccent")} hint={t("magazine.editor.fieldHints.faqTitleAccent")}>
                <TextInput value={c.faq.titleAccent} onChange={(v) => set("faq.titleAccent", v)} />
              </Field>
            </div>
            <Field label={f("faqDescription")}>
              <TextArea rows={2} value={c.faq.description} onChange={(v) => set("faq.description", v)} />
            </Field>
            {faqItems.map((it, i) => (
              <div key={`${rk}-faq-${i}`} className="space-y-3 rounded-xl border border-a-ink/[0.07] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/60">
                    {a("faqN", { n: i + 1 })}
                  </span>
                  <button type="button" onClick={() => setFaqItems(faqItems.filter((_, j) => j !== i))} aria-label={a("removeFaq")} title={a("removeFaq")} className={`${dangerBtn} h-8 w-8 justify-center px-0`}>
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Field label={f("faqQ")}>
                  <TextInput value={it.q} onChange={(v) => setFaqItems(faqItems.map((x, j) => (j === i ? { ...x, q: v } : x)))} />
                </Field>
                <Field label={f("faqA")}>
                  <TextArea rows={2} value={it.a} onChange={(v) => setFaqItems(faqItems.map((x, j) => (j === i ? { ...x, a: v } : x)))} />
                </Field>
              </div>
            ))}
            <button type="button" onClick={() => setFaqItems([...faqItems, blankFaqItem()])} className={ghostBtn}>
              <Plus className="h-3.5 w-3.5" />
              {a("addFaq")}
            </button>
          </>
        ) : (
          <p className="text-[12px] text-a-ink/45">{t("magazine.editor.chapterOff")}</p>
        )}
      </Group>

      {/* ================= profile ================= */}
      <Group title={g("profile")} hint={t("magazine.editor.groupHints.profile")} open={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("profileName")} required>
            <TextInput value={c.profile?.name} onChange={(v) => set("profile.name", v)} />
          </Field>
          <Field label={f("profileRole")} hint={t("magazine.editor.fieldHints.profileRole")}>
            <TextInput value={c.profile?.role} onChange={(v) => set("profile.role", v)} />
          </Field>
        </div>
        <Field label={f("profileWorksFor")} hint={t("magazine.editor.fieldHints.profileWorksFor")}>
          <TextInput value={c.profile?.worksFor} onChange={(v) => set("profile.worksFor", v)} />
        </Field>
        <Field label={f("profileText")}>
          <TextArea rows={2} value={c.profile?.text} onChange={(v) => set("profile.text", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("profileLinkLabel")}>
            <TextInput value={c.profile?.link?.label} onChange={(v) => set("profile.link.label", v)} />
          </Field>
          <Field label={f("profileLinkHref")} hint="https://…">
            <TextInput value={c.profile?.link?.href} onChange={(v) => set("profile.link.href", v)} />
          </Field>
        </div>
      </Group>

      {/* ================= wine band ================= */}
      <Group title={g("wine")} hint={hasWine ? t("magazine.editor.groupHints.wine") : t("magazine.editor.groupHints.wineNone")} open={false}>
        <Field label={f("wineHeading")}>
          <TextInput value={c.wine?.heading} onChange={(v) => set("wine.heading", v)} />
        </Field>
        <Field label={f("wineText")}>
          <TextArea rows={2} value={c.wine?.text} onChange={(v) => set("wine.text", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("wineCta")}>
            <TextInput value={c.wine?.cta} onChange={(v) => set("wine.cta", v)} />
          </Field>
          <Field label={f("winePhotoAlt")} hint={t("magazine.editor.fieldHints.winePhotoAlt")}>
            <TextInput value={c.winePhotoAlt} onChange={(v) => set("winePhotoAlt", v)} />
          </Field>
        </div>
      </Group>

      {/* ================= closing paths ================= */}
      <Group title={g("paths")} hint={t("magazine.editor.groupHints.paths")} open={false}>
        {PATH_IDS.map((id) => {
          const p = (c.paths ?? []).find((x) => x.id === id) ?? { id, icon: id, title: "", text: "", href: "" };
          const setPath = (patch) => {
            const list = PATH_IDS.map(
              (pid) => (c.paths ?? []).find((x) => x.id === pid) ?? { id: pid, icon: pid, title: "", text: "", href: "" },
            );
            set("paths", list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
          };
          return (
            <div key={id} className="grid gap-3 rounded-xl border border-a-ink/[0.07] p-3 sm:grid-cols-[110px_1fr_1fr_1fr]">
              <span className="self-end pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-a-accent/60">
                {t(`magazine.editor.pathIds.${id}`)}
              </span>
              <Field label={f("pathTitle")}>
                <TextInput value={p.title} onChange={(v) => setPath({ title: v })} />
              </Field>
              <Field label={f("pathText")}>
                <TextInput value={p.text} onChange={(v) => setPath({ text: v })} />
              </Field>
              <Field label={f("pathHref")} hint="/regionen#garda">
                <TextInput value={p.href} onChange={(v) => setPath({ href: v })} />
              </Field>
            </div>
          );
        })}
      </Group>

      {/* ================= teaser: magazine card ================= */}
      <Group title={g("teaserMagazin")} hint={t("magazine.editor.groupHints.teaserMagazin")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("tmEyebrow")}>
            <TextInput value={c.teaserMagazin?.eyebrow} onChange={(v) => set("teaserMagazin.eyebrow", v)} />
          </Field>
          <Field label={f("tmBadge")}>
            <TextInput value={c.teaserMagazin?.badge} onChange={(v) => set("teaserMagazin.badge", v)} />
          </Field>
        </div>
        <Field label={f("tmTitle")} required>
          <TextInput value={c.teaserMagazin?.title} onChange={(v) => set("teaserMagazin.title", v)} />
        </Field>
        <Field label={f("tmTeaser")} required count={c.teaserMagazin?.teaser} max={LIMITS.teaser}>
          <TextArea rows={2} value={c.teaserMagazin?.teaser} onChange={(v) => set("teaserMagazin.teaser", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("tmMeta")} hint={t("magazine.editor.fieldHints.tmMeta")}>
            <TextInput value={c.teaserMagazin?.meta} onChange={(v) => set("teaserMagazin.meta", v)} />
          </Field>
          <Field label={f("tmCta")} required>
            <TextInput value={c.teaserMagazin?.cta} onChange={(v) => set("teaserMagazin.cta", v)} />
          </Field>
        </div>
      </Group>

      {/* ================= teaser: region page ================= */}
      <Group
        title={g("teaserRegion")}
        hint={region ? t("magazine.editor.groupHints.teaserRegion") : t("magazine.editor.groupHints.teaserRegionNone")}
        open={!!region}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("trEyebrow")}>
            <TextInput value={c.teaserRegion?.eyebrow} onChange={(v) => set("teaserRegion.eyebrow", v)} />
          </Field>
          <Field label={f("trTitle")} required={!!region}>
            <TextInput value={c.teaserRegion?.title} onChange={(v) => set("teaserRegion.title", v)} />
          </Field>
        </div>
        <Field label={f("trParagraphs")} hint={t("magazine.editor.fieldHints.paragraphs")}>
          <ParagraphsArea value={c.teaserRegion?.paragraphs} onChange={(v) => set("teaserRegion.paragraphs", v)} resetKey={rk} rows={3} />
        </Field>
        <Field label={f("trPull")} hint={t("magazine.editor.fieldHints.trPull")} count={c.teaserRegion?.pull} max={LIMITS.pull}>
          <TextArea rows={2} value={c.teaserRegion?.pull} onChange={(v) => set("teaserRegion.pull", v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={f("trCtaPrimary")} required={!!region}>
            <TextInput value={c.teaserRegion?.ctaPrimary} onChange={(v) => set("teaserRegion.ctaPrimary", v)} />
          </Field>
          <Field label={f("trCtaSecondary")} required={!!region}>
            <TextInput value={c.teaserRegion?.ctaSecondary} onChange={(v) => set("teaserRegion.ctaSecondary", v)} />
          </Field>
        </div>
      </Group>
    </div>
  );
}
