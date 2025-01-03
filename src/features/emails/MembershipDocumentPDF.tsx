import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { DocumentData } from '../membership/actions/generate-document';

import MembershipLongText from './MembershipLongText';

// Debug logging for file existence
const fontPath = `${process.cwd()}/public/fonts/Aptos.ttf`;
// const boldFontPath = `${process.cwd()}/public/fonts/AptosBold.ttf`;
const logoPath = `${process.cwd()}/public/logo.png`;

// try {

Font.register({
  family: 'Helvetica-Bold',
  src: 'Helvetica-Bold',
});
// Register Aptos font
Font.register({
  family: 'Aptos',
  fonts: [
    {
      fontFamily: 'Aptos',
      src: fontPath,
    },
  ],
});

export const styles = StyleSheet.create({
  logo: {
    width: 220,
    height: 80,
    objectFit: 'contain',
  },
  page: {
    paddingTop: 220,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontFamily: 'Aptos',
    fontSize: 12,
    backgroundColor: '#fff',
    color: '#333333',
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 24,
    fontFamily: 'Helvetica-Bold',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: '20px 35px',
    backgroundColor: '#f8f8f8',
    borderBottom: '2px solid #9ef0e4',
  },
  headerLogo: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#9ef0e4',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    marginBottom: 32,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    minHeight: 40,
  },
  tableCell: {
    flex: 1,
    padding: 16,
    fontSize: 12,
    borderRight: '1px solid #cccccc',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  tableCellHeader: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#f8f8f8',
    color: '#333333',
  },
  memberTable: {
    width: '100%',
    marginBottom: 32,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  memberTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    minHeight: 40,
  },
  memberTableCell: {
    padding: 16,
    fontSize: 12,
    borderRight: '1px solid #cccccc',
  },
  memberTableCellLast: {
    borderRight: 'none',
  },
  memberTableHeader: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#f8f8f8',
    color: '#333333',
  },
  detailsTable: {
    width: '100%',
    marginBottom: 32,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  detailsTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    minHeight: 40,
  },
  detailsTableCell: {
    flex: 1,
    padding: 16,
    fontSize: 12,
    borderRight: '1px solid #cccccc',
  },
  detailsTableCellLast: {
    borderRight: 'none',
  },
  detailsTableHeader: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#f8f8f8',
    color: '#333333',
  },
  detailsTableValue: {
    fontFamily: 'Helvetica-Bold',
  },
  paymentTable: {
    width: '100%',
    marginTop: 40,
    marginBottom: 32,
    backgroundColor: '#f8f8f8',
    padding: 24,
    borderRadius: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    fontSize: 12,
    gap: 40,
  },
  paymentLabel: {
    flex: 1,
    maxWidth: 200,
    textAlign: 'right',
    color: '#666666',
  },
  paymentValue: {
    width: 120,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  paymentTotal: {
    borderTop: '2px solid #333333',
    marginTop: 12,
    paddingTop: 12,
    fontFamily: 'Helvetica-Bold',
  },
  contactsSection: {
    marginTop: 40,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'left',
  },
  contactsTable: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  contactsRow: {
    flex: 1,
    padding: 20,
    fontSize: 12,
    border: '1px solid #cccccc',
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  contactsHeader: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#333333',
    fontSize: 14,
  },
  emergencyNote: {
    fontSize: 11,
    marginTop: 20,
    lineHeight: 1.5,
    color: '#666666',
    padding: '16px 20px',
    backgroundColor: '#fff4f4',
    borderRadius: 4,
  },
  tripDurationsSection: {
    marginBottom: 32,
  },
  tripDurationsTable: {
    width: '100%',
    marginBottom: 16,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  tripDurationsRow: {
    flexDirection: 'row',
    flex: 1,
    borderBottom: '1px solid #cccccc',
    padding: 16,
  },
  tripDurationsHeader: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  countriesSection: {
    marginBottom: 32,
  },
  countriesContent: {
    width: '100%',
    marginBottom: 16,
    border: '1px solid #cccccc',
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  countriesHeader: {
    fontFamily: 'Helvetica-Bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333333',
    fontSize: 14,
  },
  countriesText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#666666',
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTable: {
    width: '100%',
    marginBottom: 16,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  benefitsRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    padding: 16,
  },
  benefitsHeader: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#333333',
  },
  benefitsCell: {
    flex: 1,
    fontSize: 11,
    paddingRight: 8,
    color: '#666666',
  },
  benefitsCellLast: {
    flex: 0.5,
    fontSize: 11,
    color: '#666666',
  },
});

interface Props {
  data: DocumentData;
}

export const MembershipDocumentPDF = ({ data }: Props) => {
  const primaryMember = data.members.find((member) => member.is_primary);
  return (
    <Document>
      <Page size='A4' wrap={false} style={styles.page}>
        <Header membershipNumber={data.membership_number} />

        {/* membership number */}

        {/* Contact Information Grid */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.tableCellHeader]}>
              <Text>Name and Address of Membership Holder</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellHeader, styles.tableCellLast]}>
              <Text>Contact Details</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>
                {primaryMember?.salutation || ''} {primaryMember?.first_name || ''} {primaryMember?.last_name || ''}
              </Text>
              <Text>{primaryMember?.address || ''}</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellLast]}>
              <Text>Email: {primaryMember?.email || ''}</Text>
              <Text>Contact Number: {primaryMember?.contact_number || ''}</Text>
              <Text>Home Phone: {primaryMember?.home_phone || ''}</Text>
            </View>
          </View>
        </View>

        {/* Members Table */}
        {Array.isArray(data.members) && data.members.length > 0 && (
          <View style={styles.memberTable}>
            <View style={styles.memberTableRow}>
              <View style={[styles.memberTableCell, styles.memberTableHeader, { width: '100%' }]}>
                <Text>Member(s)</Text>
              </View>
            </View>
            <View style={styles.memberTableRow}>
              <View style={[styles.memberTableCell, styles.memberTableHeader, { width: '15%' }]}>
                <Text>Title</Text>
              </View>
              <View style={[styles.memberTableCell, styles.memberTableHeader, { width: '25%' }]}>
                <Text>First Name</Text>
              </View>
              <View style={[styles.memberTableCell, styles.memberTableHeader, { width: '25%' }]}>
                <Text>Surname</Text>
              </View>
              <View style={[styles.memberTableCell, styles.memberTableHeader, { width: '10%' }]}>
                <Text>Age</Text>
              </View>
              <View
                style={[styles.memberTableCell, styles.memberTableHeader, styles.memberTableCellLast, { width: '25%' }]}
              >
                <Text>Medical Declaration</Text>
              </View>
            </View>
            {data.members.map((member, index) => (
              <View key={index} style={styles.memberTableRow}>
                <View style={[styles.memberTableCell, { width: '15%' }]}>
                  <Text>{member?.salutation || ''}</Text>
                </View>
                <View style={[styles.memberTableCell, { width: '25%' }]}>
                  <Text>{member?.first_name || ''}</Text>
                </View>
                <View style={[styles.memberTableCell, { width: '25%' }]}>
                  <Text>{member?.last_name || ''}</Text>
                </View>
                <View style={[styles.memberTableCell, { width: '10%' }]}>
                  <Text>{member?.age || ''}</Text>
                </View>
                <View style={[styles.memberTableCell, styles.memberTableCellLast, { width: '25%' }]}>
                  <Text>{member?.has_declaration || 'No'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Membership Details */}
        <View style={styles.detailsTable}>
          <View style={styles.detailsTableRow}>
            <View style={[styles.detailsTableCell, styles.detailsTableHeader]}>
              <Text>Membership</Text>
            </View>
            <View style={[styles.detailsTableCell, styles.detailsTableHeader, styles.detailsTableCellLast]}>
              <Text>Membership Details</Text>
            </View>
          </View>
          <View style={styles.detailsTableRow}>
            <View style={styles.detailsTableCell}>
              <Text>
                Date of Issue: <Text style={styles.detailsTableValue}>{data.purchase_date}</Text>
              </Text>
              <Text>
                Membership Type: <Text style={styles.detailsTableValue}>{data.membership_type}</Text>
              </Text>
              <Text>
                Membership Coverage: <Text style={styles.detailsTableValue}>{data.coverage_type}</Text>
              </Text>
              <Text>
                Destination Coverage: <Text style={styles.detailsTableValue}>{data.destination_coverage}</Text>
              </Text>
              <Text>
                Membership Start Date: <Text style={styles.detailsTableValue}>{data.start_date}</Text>
              </Text>
              <Text>
                Membership End Date: <Text style={styles.detailsTableValue}>{data.end_date}</Text>
              </Text>
            </View>
            <View style={[styles.detailsTableCell, styles.detailsTableCellLast]}>
              <Text>
                Excess: <Text style={styles.detailsTableValue}>$100</Text>
              </Text>
              <Text>
                Hazardous Pursuits Level: <Text style={styles.detailsTableValue}>Categories 1 - 4</Text>
              </Text>
              <Text>
                Emergency Medical & Repatriation Expenses: <Text style={styles.detailsTableValue}>$10 million USD</Text>
              </Text>
              <Text>
                Winter Sports: <Text style={styles.detailsTableValue}>Covered</Text>
              </Text>
              <Text>
                Cruise: <Text style={styles.detailsTableValue}>Covered</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentTable}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Base Price</Text>
            <Text style={styles.paymentValue}>{data.base_price}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Added Medical Risk Premium</Text>
            <Text style={styles.paymentValue}>{data.medical_risk_premium}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Discount Applied</Text>
            <Text style={styles.paymentValue}>-{data.discount}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>{data.subtotal}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>TAX @ 20%</Text>
            <Text style={styles.paymentValue}>{data.tax}</Text>
          </View>
          <View style={[styles.paymentRow, styles.paymentTotal]}>
            <Text style={styles.paymentLabel}>Total Paid</Text>
            <Text style={styles.paymentValue}>{data.total_paid}</Text>
          </View>
        </View>

        {/* Important Contacts */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>IMPORTANT CONTACTS</Text>
          <View style={styles.contactsTable}>
            <View style={styles.contactsRow}>
              <Text style={styles.contactsHeader}>24/7 Emergency Assistance</Text>
              <Text>Specialist Rescue Group</Text>
              <Link src='tel:+44 (0) 20 3670 1885'>+44 (0) 20 3670 1885</Link>
              <Link src='mailto:asketi@specialistrescuegroup.com'>asketi@specialistrescuegroup.com</Link>
            </View>
            <View style={styles.contactsRow}>
              <Text style={styles.contactsHeader}>Making A Claim</Text>
              <Text>Mon – Fri 9.00 am - 4.30 pm</Text>
              <Link src='tel:+44 (0) 2035 198 237'>+44 (0) 2035 198 237</Link>
              <Link src='mailto:claims@asketi.com'>claims@asketi.com</Link>
            </View>
          </View>
          <Text style={styles.emergencyNote}>
            24/7 Emergency Assistance is available in the event of an emergency relating to a medical problem. You must
            notify the Emergency Assistance company (agents acting on behalf of ASKETI) as soon as possible of any
            serious illness or injury while abroad which necessitates admittance as an in-patient or out-patient if
            costs are likely to exceed $300 (USD), or before any arrangements are made for repatriation or curtailment.
            Failure to notify the Emergency Assistance company as soon as possible may result in any claims being
            declined and Membership cancelled.
          </Text>
        </View>

        {/* Maximum Trip Durations */}
        <View style={styles.tripDurationsSection}>
          <Text style={styles.sectionTitle}>MAXIMUM TRIP DURATIONS</Text>
          <View style={styles.tripDurationsTable}>
            <View style={styles.tripDurationsRow}>
              <Text style={styles.tripDurationsHeader}>Duration Type</Text>
              <Text style={styles.tripDurationsHeader}>Maximum Trip Duration</Text>
            </View>
            <View style={styles.tripDurationsRow}>
              <Text style={{ flex: 1 }}>{data.duration_type}</Text>
              <Text style={{ flex: 1 }}>{data.maximum_trip_duration}</Text>
            </View>
          </View>
        </View>

        {/* Countries Covered */}
        <View style={styles.countriesSection}>
          <Text style={styles.sectionTitle}>Countries Covered</Text>
          <View style={styles.countriesContent}>
            <Text style={styles.countriesHeader}>Worldwide Platinum Membership</Text>
            <Text>All Countries</Text>

            <Text style={styles.countriesHeader}>Worldwide Comprehensive Membership</Text>
            <Text style={styles.countriesText}>
              All, EXCLUDING Afghanistan; Algeria; Angola; Antarctica; Armenia; Azerbaijan; Bangladesh; Belarus; Belize;
              Benin; Bolivia; Brunei; Burkina Faso; Burundi; Cameroon; Central African Republic; Chad; China; Colombia;
              Comoros; Congo; Côte d&apos;Ivoires; Cuba; Democratic Republic of the Congo; Djibouti; Dominican Republic;
              Ecuador; Egypt; El Salvador; Equatorial Guinea; Eritrea; Eswatini; Ethiopia; Gabon; Gambia; Georgia;
              Ghana; Grenada; Guatemala; Guinea; Guinea-Bissau; Guyana; Haiti; Heard Island and McDonald Islands;
              Honduras; Iran; Iraq; Israel; Jamaica; Jordan; Kazakhstan; Kenya; Kiribati; Kosovo; Kuwait; Kyrgyzstan;
              Lebanon; Lesotho; Liberia; Libya; Macao; Madagascar; Malawi; Mali; Mauritania; Mexico; Moldova; Mongolia;
              Morocco; Mozambique; Myanmar; Namibia; Nepal; New Caledona; Nicaragua; Niger; Nigeria; North Korea;
              Pakistan; Palestinian Territories; Panama; Papua New Guinea; Peru; Russian Federation; Rwanda; Saint
              Vincent and the Grenadines; Senegal; Serbia; Sierra Leones; Solomon Islands; Somalia; South Africa; South
              Sudan; Sudan; Syria; Taiwan; Tajikistan; Tanzania; Timor-Leste; Togo; Trinidad and Tobago; Tunisia;
              Turkmenistan; Tuvalu; Uganda; Ukraine; Uzbekistan; Venezuela; Western Sahara&apos;; Yemen; Zambia;
              Zimbabwe
            </Text>
          </View>
        </View>

        {/* Benefits Table */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Membership Details</Text>
          <View style={styles.benefitsTable}>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsHeader}>Benefit</Text>
              <Text style={styles.benefitsHeader}>
                Benefits (Shown as Aggregated Total Per Membership) Stated In USD
              </Text>
              <Text style={styles.benefitsHeader}>Excess (If Applicable)</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Cancellation or Curtailment</Text>
              <Text style={styles.benefitsCell}>Up to $1,500</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Emergency Medical, Repatriation & Evacuation Expenses</Text>
              <Text style={styles.benefitsCell}>Up to $10,000,000</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Hospital Confinement Benefit</Text>
              <Text style={styles.benefitsCell}>$10 per 24 hours up to a maximum of $500</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Personal Accident; Accidental Death</Text>
              <Text style={styles.benefitsCell}>Up to $10,000 ($1,500 if under 18 or over 69)</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Personal Accident; Loss of Limb or Sight</Text>
              <Text style={styles.benefitsCell}>Up to $10,000 ($1,500 if under 18 or over 69)</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Personal Accident; Permanent Total Disablement</Text>
              <Text style={styles.benefitsCell}>Up to $10,000 ($1,500 if under 18 or over 69)</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Missed Departure</Text>
              <Text style={styles.benefitsCell}>Up to $500</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Baggage</Text>
              <Text style={styles.benefitsCell}>Up to $1,000</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Single Article/Pair/Set Limit</Text>
              <Text style={styles.benefitsCell}>Up to $150</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Total Valuable Limit</Text>
              <Text style={styles.benefitsCell}>Up to $150</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Spectacles/Sunglasses Limit</Text>
              <Text style={styles.benefitsCell}>Up to $150</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Personal Money, Passports, Documents</Text>
              <Text style={styles.benefitsCell}>
                Up to $250{'\n'}Cash limit carried on any one Member limited to $250{'\n'}Passport, Tickets & Documents
                Up to $100
              </Text>
              <Text style={styles.benefitsCellLast}>$50</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Personal Liability{'\n'}Rented Accommodation</Text>
              <Text style={styles.benefitsCell}>Up to $20,000{'\n'}Up to $2,000</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
            <View style={styles.benefitsRow}>
              <Text style={styles.benefitsCell}>Legal Expenses & Assistance</Text>
              <Text style={styles.benefitsCell}>Up to $2,000</Text>
              <Text style={styles.benefitsCellLast}>$100</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <MembershipLongText />

        {/* Footer */}
        <View style={styles.footer} fixed />
      </Page>
    </Document>
  );
};

const Header = ({ membershipNumber }: { membershipNumber: string }) => {
  return (
    <View style={styles.header} fixed>
      {logoPath ? <Image src={logoPath} style={styles.logo} /> : <Text style={styles.headerLogo}>ASKETI</Text>}
      <Text style={styles.headerSubtitle}>ASKETI Global Travel Protection Membership</Text>
      <Text style={styles.headerSubtitle}>Certificate of Membership</Text>
      <Text style={styles.headerSubtitle}>Membership Number: {membershipNumber}</Text>
    </View>
  );
};

export default MembershipDocumentPDF;
