import path from 'node:path';
import React from 'react';
import ReactPDF, { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import {
  SUMMARY,
  EXPERIENCES,
  CORE_SKILLS,
  AI_SKILLS,
  CERTIFICATIONS,
  EDUCATION,
} from '../lib/resume';

// Standard PDF base-14 fonts (Helvetica) use WinAnsiEncoding, which cannot
// represent characters like the macron in "Toitū" (U+016B). Register an
// embedded Unicode-capable TTF instead so non-Latin-1 characters render
// correctly rather than being silently mis-substituted.
Font.register({
  family: 'DejaVuSans',
  fonts: [
    { src: path.join(__dirname, 'fonts', 'DejaVuSans.ttf') },
    { src: path.join(__dirname, 'fonts', 'DejaVuSans-Bold.ttf'), fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'DejaVuSans', color: '#1a1a1a' },
  name: { fontSize: 24, fontFamily: 'DejaVuSans', fontWeight: 'bold', marginBottom: 2 },
  title: { fontSize: 12, color: '#555555', marginBottom: 12 },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'DejaVuSans',
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: { lineHeight: 1.5 },
  expBlock: { marginBottom: 10 },
  company: { fontSize: 11, fontFamily: 'DejaVuSans', fontWeight: 'bold' },
  meta: { fontSize: 9, color: '#555555', marginBottom: 4 },
  role: { marginTop: 6 },
  roleHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  roleTitle: { fontSize: 10, fontFamily: 'DejaVuSans', fontWeight: 'bold' },
  roleDates: { fontSize: 9, color: '#555555' },
  bullet: { flexDirection: 'row', marginTop: 2 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  skillTag: {
    fontSize: 9,
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  certItem: { fontSize: 9, marginBottom: 2 },
  eduItem: { marginBottom: 6 },
  eduSchool: { fontSize: 10, fontFamily: 'DejaVuSans', fontWeight: 'bold' },
});

function ResumeDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>Yufei Liu</Text>
        <Text style={styles.title}>Senior Full Stack Developer · Wellington, NZ</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{SUMMARY}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {EXPERIENCES.map((exp) => (
            <View key={exp.company} style={styles.expBlock}>
              <Text style={styles.company}>{exp.company} — {exp.location}</Text>
              <Text style={styles.meta}>{exp.span}</Text>
              {exp.roles.map((role, i) => (
                <View key={i} style={styles.role}>
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDates}>{role.dates}</Text>
                  </View>
                  {role.bullets.map((bullet, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {[...CORE_SKILLS, ...AI_SKILLS].map((skill) => (
              <Text key={skill} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {CERTIFICATIONS.map((cert, i) => (
            <Text key={i} style={styles.certItem}>• {cert}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {EDUCATION.map((edu, i) => (
            <View key={i} style={styles.eduItem}>
              <Text style={styles.eduSchool}>{edu.school}</Text>
              <Text style={styles.meta}>{edu.degree} · {edu.years}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

async function main() {
  const outputPath = path.join(__dirname, '..', 'public', 'resume-yufei-liu.pdf');
  await ReactPDF.renderToFile(<ResumeDocument />, outputPath);
  console.log(`Wrote ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
