import { Font, StyleSheet, Text, View } from '@react-pdf/renderer';

const longTextStyles = StyleSheet.create({
  // ...styles,
  termsSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  termsTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  termsHuge: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  termsImportant: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
  },
  termsWarning: {
    fontSize: 10,
    marginBottom: 16,
  },
  termsIntro: {
    fontSize: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    marginTop: 24,
  },
  definitionItem: {
    marginBottom: 12,
  },
  definitionTerm: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 10,
  },
  emergencyWarning: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subsection: {
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  subsectionText: {
    fontSize: 10,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletPoint: {
    // width: 10,
    fontSize: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 10,
  },
  subListItem: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 4,
  },
});

export const MembershipLongText = () => (
  <>
    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.termsHuge}>
        MEMBER SERVICES AGREEMENT AND TERMS OF SERVICE FOR ALL INDIVIDUAL, COUPLE, FAMILY & GROUP; ANNUAL, ANNUAL
        MULTI-TRIP, SINGLE TRIP; COMPREHENSIVE AND PLATINUM MEMEBRSHIPS.
      </Text>

      <Text style={longTextStyles.termsImportant}>IMPORTANT</Text>

      <Text style={longTextStyles.termsWarning}>
        BY PURCHASING AND/OR USING YOUR ASKETI MEMBERSHIP YOU REPRESENT AND WARRANT THAT YOU POSSESS THE LEGAL RIGHT AND
        ABILITY, ON BEHALF OF EACH MEMBER LISTED ON THE ENROLLMENT APPLICATION, INCLUDING BUT NOT LIMITED TO EACH MINOR
        CHILD OF WHOM MEMBER IS A PARENT OR GUARDIAN, TO AGREE TO BE BOUND BY THIS MEMBER SERVICES AGREEMENT AND ITS
        TERMS AND CONDITIONS.
      </Text>

      <Text style={longTextStyles.termsIntro}>
        This Member Services Agreement (&quot;Agreement&quot;) is a legal agreement between Member and ASKETI Limited
        (&quot;Company&quot;). Company reserves the right, in its sole discretion, to reject any application for ASKETI
        Global Travel Protection Membership, in which case this Agreement shall be null and void. If accepted, this
        Agreement, for the membership type and term purchased, shall be effective at 12am UTC on the effective date and
        continue through 11:59pm UTC on the end date.
      </Text>

      <Text style={longTextStyles.sectionTitle}>Section One: Definitions</Text>

      <Text style={longTextStyles.termsIntro}>
        In addition to those terms defined elsewhere in this Agreement, the following terms, when capitalised, shall be
        ascribed meaning as follows:
      </Text>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Designated Representative&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – An individual identified to Company by the Member as their authorised decision maker for all matters related
          to this Agreement should the Member be unable to communicate for any reason.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Field Rescue&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – The transport of a Traveling Member by ground, air, or sea to a hospital, clinic or other medical provider
          capable of providing care to a Traveling Member whose condition requires Hospitalization or is likely to cause
          serious permanent injury or death, but they are unable to get to a hospital themselves or by other commercial
          means. Field Rescue does not include any activities related to search and the Traveling Member&apos;s location
          must be known.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Foreign Country&quot;</Text>
        <Text style={longTextStyles.definitionText}>– Any country other than the Member&apos;s Home Country.</Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Company Contractor&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – Any Company contractor, sub-contractor, or other outsourced provider that provides products or services
          pursuant to this Agreement.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Evacuation Criteria&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – For purposes of Section 2.1.4 Local Field Rescue Services only, a Member who (1) is located in the
          backcountry, beyond the reach of motorized vehicles, and/or beyond a marked trailhead; and (2) meets the
          criteria for Field Rescue
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;High Altitude Travel&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – When a Member is Traveling above 15,000 feet above sea level, or actively ascending to or has recently
          descended from an altitude above 15,000 feet above sea level. For purposes of clarity, the foregoing is
          intended to include all trekking, climbing, and similar activities in mountainous regions.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;High Altitude Membership Upgrade&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – A selection made and paid for by the Member that entitles the Member to Medical Transport Services during
          High Altitude Travel pursuant to the terms of this Agreement; available and applicable only to Members 16
          years old and older.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Home Address&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – The Member&apos;s residence as provided by the Member in the enrolment application and/or as described in an
          official state or government listed identity document.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Home Country&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – The country in which the Member&apos;s Home Address is located.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Hospitalised&quot; or &quot;Hospitalisation&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – Admission to a medical facility on a continuous, in-patient basis necessitated by a medically diagnosable
          illness or injury and not for convenience or any other reason.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Member&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – The individual(s) named on the enrolment application that has been approved for Membership by Company and
          for whom the applicable membership fees has been paid.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Qualifying Security Event&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – Is an occurrence where a Member(s) that has purchased a Security Membership Upgrade is temporarily located
          in a Foreign Country and: (i) officials of such Foreign Country or the US State Department, for reasons other
          than medical, issues a recommendation that travelers should evacuate such Foreign Country; and/or (ii) the
          Member has been expelled or declared persona non grata in writing by the authority of the government of such
          Foreign Country, and/or (iii) security events have created a situation in which the Member is in danger of
          imminent grievous bodily harm, as determined by Company, to the extent that the Member must be evacuated; AND
          (iv) the Traveling Member cannot obtain commercial transport to the nearest safe location within time to avert
          imminent grievous bodily harm or to comply with the time allowed to leave such Foreign Country pursuant to the
          orders of the recognized government of the Foreign Country.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Security Membership Upgrade&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – A selection made and paid for by the Member that entitles the Member to security evacuation services
          pursuant to the terms of this Agreement.
        </Text>
      </View>

      <View style={longTextStyles.definitionItem}>
        <Text style={longTextStyles.definitionTerm}>&quot;Traveling&quot;</Text>
        <Text style={longTextStyles.definitionText}>
          – When a Member is located more than 100 miles from their Home Address they are deemed to be Traveling for the
          purposes of Service eligibility.
        </Text>
      </View>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.sectionTitle}>Section Two: Services</Text>

      <Text style={longTextStyles.emergencyWarning}>
        IF A MEMBER EXPERIENCES AN EMERGENCY OF ANY NATURE, INCLUDING, BUT NOT LIMITED TO, A MEDICAL OR SECURITY
        EMERGENCY, THE MEMBER SHOULD IMMEDIATELY CALL LOCAL EMERGENCY MEDICAL OR SECURITY SERVICES (I.E. 911).
      </Text>

      <View style={longTextStyles.subsection}>
        <Text style={longTextStyles.subsectionText}>
          2.1 Travel Services. The following services are available to Members during the term of their Membership when
          they are Traveling:
        </Text>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.1. Health Information Services. To the extent permitted by law, Company will provide Traveling Member
            with health information services by telephone, email, fax transmission, or other appropriate modes of
            communication, in Company&apos;s sole discretion, at the request of any Traveling Member. The health
            information services do not establish diagnosis, treatment or a physician-patient relationship.
          </Text>
        </View>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.2 Medical Transport Services. To the extent permitted by law and subject to the conditions, exclusions,
            and limitations of this Section 2.1.2, in the event a Traveling Member is Hospitalized or in need of
            Hospitalization, Company will provide and arrange all necessary and ordinary expenses for: (i) Field Rescue;
            2.1.2, in the event a Traveling Member is Hospitalized or in need of Hospitalization, Company will provide
            and arrange all necessary and ordinary expenses for: (i) Field Rescue; (ii) air and/or surface transport to
            the hospital of choice located within the Member&apos;s Home Country; and/or (iii) Transport of Mortal
            Remains under 2.1.3 below (&quot;Medical Transport Services&quot;).
          </Text>
          <Text style={longTextStyles.warningText}>
            IN ORDER TO QUALIFY FOR MEDICAL TRANSPORT SERVICES, THE TRAVELING MEMBER OR THEIR DESIGNATED REPRESENTATIVE
            MUST CONTACT COMPANY AT THE TIME OF THE EVENT REQUIRING HOSPITALIZATION. COMPANY SHALL NOT BE OBLIGATED
            UNDER ANY CIRCUMSTANCES TO REIMBURSE A MEMBER OR PAY ANY THIRD-PARTY SERVICE PROVIDER FOR ANY TRANSPORT
            COSTS WHICH HAVE BEEN ARRANGED BY THE MEMBER OR ON BEHALF OF THE MEMBER BY ANY THIRD PARTY.
          </Text>

          <Text style={longTextStyles.subsectionText}>
            a. Company reserves the right to determine, in its sole discretion (i) whether a Traveling Member’s
            condition is sufficiently serious to warrant Medical Transport Services, and (ii) the mode of transport.
            Company shall not be under any obligation to provide more than two (2) such transports to any Member in any
            twelve (12) month period (for Family memberships, the number of transports are limited to (1) transport each
            for a common accident or two (2) transports in the aggregate). Company shall not be under any obligation to
            provide Medical Transport Services if, as may be determined by Company in its sole discretion: (i) the
            Traveling Member is not reasonably accessible and cannot be transported safely or is located in a region
            that is not safely accessible (Traveling Members who become ill on cruise ships must disembark at an
            accessible medical facility or port prior to transport).; (ii) the Traveling Member has a contagious or
            infectious disease; (iii) the Traveling Member’s primary diagnosis is psychiatric in nature; (iv) the
            Traveling Member’s condition is self-inflicted (including but not limited to not taking precautionary
            measures at the onset of a medical event if reasonably possible); (v) the Traveling Member has committed or
            is accused of committing a criminal act; (vi) the Traveling Member has ever been diagnosed with and/or
            treated for a condition(s) for which an organ transplant is indicated (whether currently on a transplant
            list or not) and such transport is related, directly or indirectly, to such condition(s), treatment and/or
            transplant; (vii) the Traveling Member is Hospitalized or in need of Hospitalization due to circumstances
            that were diagnosed or treated, or for which symptoms existed which would cause an ordinarily prudent person
            to seek such diagnosis or treatment, within forty-five (45) days (one year for Traveling Members between
            ages 75-85 years old) prior to the effective date of this Agreement or prior to traveling; (viii) the
            Traveling Member’s condition occurred while or resulted from serving as an armed or unarmed combatant or in
            a security role during an act of declared or undeclared war, invasion, armed conflict, police action, or
            civil disorder; (ix) the Traveling Member is in her third trimester of pregnancy (after the 186th day); (x)
            the Traveling Member’s condition is caused by the intentional ingestion/use and/or overdose of alcohol, a
            controlled or banned substance, or is hospitalized due to the use of alcohol, drugs or intoxicants not
            prescribed by a physician, (xi) the Traveling Member cannot be transported safely; (xii) the Traveling
            Member has been exposed to nuclear reaction, radioactive contamination or chemical contamination; (xiii) the
            Traveling Member is traveling against the advice of a treating physician or Company’s medical professionals,
            while waiting for treatment, or is traveling for the purpose of obtaining medical treatment; (xiv) the
            Traveling Member has been treated and discharged from a care facility; (xv) the Traveling Member is
            traveling in the Arctic above 80th parallel North OR on/near the Antarctic continent below the 60th parallel
            South; (xvi) the Traveling Member failed to maintain immigration, work residence or similar visas, permits
            or other documentation necessary for transport; (xvii) the Traveling Member is engaged in High Altitude
            Travel and has not otherwise purchased a High Altitude Membership Upgrade or is under the age of 16; OR
            (xviii) the Traveling Member is over 85 years old.
          </Text>
        </View>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.3 Transport of Mortal Remains Services. To the extent permitted by law and subject to the terms,
            limitations and exclusions of Section 2.1.2 above and upon a Traveling Member&apos;s estate executor&apos;s
            request, Company will arrange and provide transport of a Traveling Member&apos;s mortal remains to the
            country in which the Traveling Member&apos;s passport was issued. Company reserves the right to determine
            the mode and timing of transport. and upon a Traveling Member&apos;s estate executor&apos;s request, Company
            will arrange and provide transport of a Traveling Member&apos;s mortal remains to the country in which the
            Traveling Member&apos;s passport was issued. Company reserves the right to determine the mode and timing of
            transport.
          </Text>
        </View>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.4 Local Field Rescue Services. To the extent permitted by law and subject to the conditions, exclusions,
            and limitations of Section 2.1.2, above, ASKETI will provide and arrange all necessary rescue, air and/or
            surface transport services, including related advisory services, to the nearest medical facility for Members
            who meet the Evacuation Criteria (&quot;Local Field Rescue Services&quot;). Services related to searching
            for Members are not included. For purposes of clarity, a Member need not be Traveling to receive Local Field
            Rescue Services.
          </Text>
        </View>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.5 Security Evacuation Services. THIS SECTION 2.1.5 ONLY APPLIES TO MEMBERS WHO HAVE SELECTED AND PAID
            FOR THE SECURITY MEMBERSHIP UPGRADE. To the extent practicable and permitted by law, and subject to the
            terms, limitations, and exclusions of this Section 2.1.5, during the term of their Membership Company will
            provide and arrange for rescue, air and/or surface transport to the Traveling Member&apos;s Home Country in
            the event the Traveling Member is experiencing a Qualifying Security Event and requests transport. Security
            Evacuation Services must be requested within 5 days of the announcement or commencement of the Qualifying
            Security Event. In dangerous regions or situations, Company personnel shall have sole discretion whether or
            not to provide Security Evacuation Services and Company at all times reserves the right to determine the
            manner in which Security Evacuation Services are provided.
          </Text>
          <Text style={longTextStyles.warningText}>
            COMPANY SHALL NOT BE OBLIGATED UNDER ANY CIRCUMSTANCES TO REIMBURSE A MEMBER OR PAY ANY THIRD-PARTY SERVICE
            PROVIDER FOR ANY ASSOCIATED TRANSPORT COSTS WHICH HAVE BEEN ARRANGED BY THE MEMBER OR BY ANY THIRD PARTY.
          </Text>

          <Text style={longTextStyles.subsectionText}>
            A. Company reserves the right to determine, in its sole discretion (i) whether a Traveling Member is
            experiencing a Qualifying Security Event sufficiently serious to warrant Security Evacuation Services, and
            (ii) the mode of transport.
          </Text>

          <Text style={longTextStyles.subsectionText}>
            B. Company shall not be under any obligation to provide more than one (1) such Security Evacuation Services
            transport to any Member in any twelve (12) month period. Company shall not be under any obligation to
            provide Security Evacuation Services to a Traveling Member if, in Company’s sole discretion: (i) the
            Traveling Member is located in a region that is not reasonably accessible; (ii) the Traveling Member is
            serving as an armed or unarmed combatant or in a security role during an act of declared or undeclared war,
            invasion, armed conflict, police action, orcivil disorder; (iii) the Traveling Member cannot be transported
            safely; (iv) the Traveling Member knowingly entered a region where the Traveling Member knew or should have
            reasonably known that a Qualifying Security Event and/or a substantial risk of grievous bodily harm existed
            or was imminent; (v) the Traveling Member purchased a Company membership while in a region where a
            Qualifying Security Event and/or a substantial risk of grievous bodily harm existed or was reasonably
            expected to be imminent prior to the purchase of the Company membership; OR (vi) The Traveling Member has
            been kidnapped, held for ransom or held against his/her will or the Traveling Member placed himself/herself
            in a situation where kidnap, being held for ransom or being held against his/her will was likely.
          </Text>
        </View>

        <View style={longTextStyles.subsection}>
          <Text style={longTextStyles.subsectionText}>
            2.1.6 General Services. Company shall make commercially reasonable efforts to provide the following services
            to Traveling Members.
          </Text>
          <Text style={longTextStyles.warningText}>
            UNLESS STATED DIFFERENTLY BELOW, THE FINAL SELECTION OF AND PAYMENT FOR ANY SUCH PROVIDER OR SERVICES SHALL
            BE THE SOLE RESPONSIBILITY OF THE MEMBER.
          </Text>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              A. Medical Locator Services. Provide a Traveling Member with names, addresses and telephone numbers for
              local hospitals, clinics, medical practitioners and/or physicians.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              B. Legal Locator Services. Provide a Traveling Member with names, addresses and telephone numbers for
              local lawyers and/or other legal professionals.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              C. Transport of Medication and Medical Supplies. Arrange for the transport of medication and other medical
              supplies to a Traveling Member.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              D. Telephonic Interpretation Services. Arrange for and/or provide telephonic translation services for a
              Traveling Member. If a Traveling Member requires the presence of an interpreter or other customized
              services, such services will be at the Member&apos;s sole expense.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              E. Security Services Referral. At the request of a Traveling Member who is experiencing threats to their
              personal safety, Company may, to the extent practicable, arrange for Company personnel or a Company
              Contractor to refer such Traveling Member to security specialists.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              F. Passport & Visa Services. Arrange for replacement passport and from authorities for a Traveling Member
              within coverage benefits.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              G. Emergency Message Relay. Relay emergency messages to a Traveling Member&apos;s family. Company shall
              use means reasonably available to ensure transmission of such messages.
            </Text>
          </View>

          <View style={longTextStyles.listItem}>
            <Text style={longTextStyles.listItemText}>
              H. Transport of Medical Records, Documents and Studies. Arrange for the dispatch of medical records from
              the Traveling Member&apos;s location to Company and/or other appropriate locations within the United
              States. If the dispatch occurs in connection with Company providing medical transport services to the
              Traveling Member, Company shall be responsible for the cost of the dispatch; otherwise the Traveling
              Member shall be responsible for any associated costs.
            </Text>
          </View>
        </View>
      </View>
    </View>

    <View style={longTextStyles.subsection}>
      <Text style={longTextStyles.subsectionText}>
        2.2 Health Information and Medical Consultation Services. THIS SECTION 2.2 ONLY APPLIES TO MEMBERS WHO HAVE
        SELECTED AND PAID FOR A GOLD MEMBERSHIP. SERVICES ARE AVAILABLE TO MEMBERS WHETHER OR NOT THEY ARE TRAVELING.
        FOR MEMBERS PURCHASING A DOMESTIC-ONLY GOLD MEMBERSHIP (&quot;DOMESTIC MEMBERSHIPS&quot;), TRAVEL SERVICES UNDER
        2.1 ABOVE ARE ONLY AVAILABLE WHEN LOCATED IN THE MEMBER&apos;S HOME COUNTRY.
      </Text>

      <View style={longTextStyles.subsection}>
        <Text style={longTextStyles.subsectionText}>
          2.2.1 Health Information Services. To the extent permitted by law, Company will provide Member with health
          information services by telephone, email, fax transmission, or other appropriate modes of communication, in
          Company&apos;s sole discretion, at the request of any Member. The health information services do not establish
          diagnosis, treatment or a physician-patient relationship.
        </Text>
      </View>

      <View style={longTextStyles.subsection}>
        <Text style={longTextStyles.subsectionText}>
          2.2.2 Medical Consultation Services. To the extent permitted by law and as requested by Member, Company will
          arrange for the provision of medical consultation services (&quot;Consultation&quot;) from Specialist Rescue
          Group(&quot;Provider&quot;), an independent, third-party association of heathcare professionals to Member.
          Separate charges may apply, based on the type of membership purchased.
        </Text>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>1.</Text>
          <Text style={longTextStyles.listItemText}>
            By requesting a Consultation, Member is entering into a doctor/patient relationship with physicians employed
            by or under contract with Provider (&quot;Provider Physicians&quot;), which shall be the provider of
            Consultations to Member.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>2.</Text>
          <Text style={longTextStyles.listItemText}>
            Unless otherwise provided under the type of membership purchased, Member shall be responsible for the
            payment of all fees, costs and expenses associated with Consultations, as may be established by Provider
            from time to time in its discretion, when located within their Home Country. For Members located in a
            Foreign Country (other than those with Domestic Memberships), Company shall arrange and provide access to
            such Consultations at its expense. Member agrees to pay for Consultations at the time of request, unless
            payment arrangements have been established through Member&apos;s employer, association, or other entity.
            Member acknowledges that all Consultations and associated medical treatment are rendered by Provider, and
            Provider shall determine, in its discretion, the mode and manner in which Consultations will occur.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>3.</Text>
          <Text style={longTextStyles.listItemText}>
            Member agrees to complete a medical history disclosure form that Provider will store electronically and make
            such information available to Provider Physicians and their supporting staff as necessary to provide
            Consultations. Member agrees to the entry of Member&apos;s medical records into the Provider&apos;s computer
            database, and understands that all reasonable measures have been taken to safeguard such medical
            information, in accordance with GDPR/ HIPAA /Local standards, but no computer or phone system is totally
            secure. Provider recognizes your privacy and, in accordance with its Privacy Policy, will not release
            information to anyone without your written authorization or as required by law, or in accordance with your
            health insurer&apos;s privacy policy if applicable.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>4.</Text>
          <Text style={longTextStyles.listItemText}>
            Consultations may be conducted by video conference, telephone, email, fax transmission, or other modes of
            communication, subject to availability. Member acknowledges that these modes of communication may not be the
            most appropriate course of treatment for Member&apos;s health care problem and that Consultations are not
            intended to replace the relationship with Member&apos;s primary care physicians. Member agrees to not use
            Consultations for any service that must be provided by Member&apos;s primary physician such as, but not
            limited to, a follow-up to an in-office visit as required by Member&apos;s healthcare plan. Member agrees to
            contact Member&apos;s local primary care physician immediately should Member&apos;s condition or symptoms
            change or worsen.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>5.</Text>
          <Text style={longTextStyles.listItemText}>
            Member acknowledges that, if Member has a primary care physician, that relationship is not replaced by
            Provider Physicians. Furthermore, Member agrees that, by requesting a Consultation from Provider, Member is
            designating Provider and the Provider Physician as member&apos;s physicians because Member&apos;s primary
            care (or other) physician, as applicable, is not available.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>6.</Text>
          <Text style={longTextStyles.listItemText}>
            Member acknowledges and agrees that in connection with any Consultation Company is acting solely s a service
            provider to Provider. Company arranges for the provision of care by Provider; Company does not provide
            medical care. In its capacity as a service provider, Company may also collect fees on Provider&apos;s
            behalf, and Member hereby acknowledges and agrees that doing so (or by paying such fees on Member&apos;s
            behalf as provided herein), does NOT establish a physician-patient relationship between Company and Member.
          </Text>
        </View>

        <View style={longTextStyles.listItem}>
          <Text style={longTextStyles.bulletPoint}>7.</Text>
          <Text style={longTextStyles.listItemText}>
            It is further acknowledged and agreed by Member that Provider operates subject to state regulation, that
            Consultation services may not be available in certain states. There is no guarantee that you will be treated
            as a patient by Provider if, for example, your medical condition cannot be properly treated by a Provider
            Physicians, or the state where you are located restricts access to telemedicine. Provider does not guarantee
            that a Consultation will result in a prescription, and Provider does not prescribe DEA controlled substances
            or certain other medications in connection with a Consultation due to the potential for abuse. Member agrees
            to fully and carefully read all provided product information and labels and to contact a physician or
            pharmacist for any questions regarding the prescription. Membership benefits and the availability and fees
            associated with Consultations may vary due to the type of membership purchased.
          </Text>
        </View>
      </View>
    </View>

    <View style={longTextStyles.subsection}>
      <Text style={longTextStyles.subsectionText}>
        2.3 Services Maximum. The aggregate maximum cost to Company for the Travel services provided pursuant to this
        Agreement shall be limited to US$10,000,000.00 per membership (individual, couple, family or group) in any 12
        month period. The maximum cost to Company for Medical Transport Services pursuant to Section 2.1.2 shall be
        US$500,000; for Local Field Rescue Services pursuant to Section 2.1.4 shall be USD$15,000; and for Transport of
        Mortal Remains services pursuant to Section 2.1.3 shall be US$15,000. The maximum cost to Company for Security
        Evacuation Services pursuant to Section 2.1.5 shall be US$100,000. maximum cost to Company for Medical Transport
        Services pursuant to Section 2.1.2 shall be US$500,000; for Local Field Rescue Services pursuant to Section
        2.1.4 shall be USD$15,000; and for Transport of Mortal Remains services pursuant to Section 2.1.3 shall be
        US$15,000. The maximum cost to Company for Security Evacuation Services pursuant to Section 2.1.5 shall be
        US$100,000.
      </Text>
    </View>

    <View style={longTextStyles.subsection}>
      <Text style={longTextStyles.subsectionText}>
        2.4 Requests for Services. Members shall be required to reimburse Company for any services, including Medical
        Transport Services, requested by the Member or their Designated Representative that do not qualify under the
        terms and conditions for such services under this Agreement. At the discretion of Company, Company may require
        that the Member guarantee payment by credit card or other means acceptable to Company before such services are
        provided, and Company shall be under no obligation to provide such services should guarantee or payment not be
        provided to Company. be under no obligation to provide such services should guarantee or payment not be provided
        to Company.
      </Text>
    </View>

    <View style={longTextStyles.subsection}>
      <Text style={longTextStyles.subsectionText}>
        2.5 General Exclusions. Company shall not be under any obligation to pay for or provide any products or services
        not explicitly set forth in this Agreement, including but not limited to, payment or reimbursement of any
        hospital, medical expenses, transport or any services not arranged and provided by Company. Any such expenses
        shall be the sole responsibility of the Member. Member acknowledges and agrees that this Agreement relates only
        to the rendering of services and the provision of certain related products as specified herein. This Agreement
        is not, nor shall it be deemed or construed as, a policy of insurance of any kind or nature. of services and the
        provision of certain related products as specified herein. This Agreement is not, nor shall it be deemed or
        construed as, a policy of insurance of any kind or nature.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        3. Payment. All membership fees are due and payable on or before the commencement of the membership. All other
        fees, including but not limited to Medical Consultation fees, are due prior to or at the time services are
        rendered. The membership fees cover the initial Medical Consultation for membership approval, record creation
        and intake by Provider, as well as updating such at each renewal.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        4. Refunds. Company will not refund any portion of any membership fee after the membership start date. Company
        will not refund any portion of any membership fee after the membership start date.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        5. Limitation of Liability. In no event shall company, provider, company contractors or their respective
        officers, employees, directors, managers, shareholders, agents, legal counsel, accountants or guarantors be
        liable for any direct, indirect, punitive, incidental, special, consequential loss or damages whatsoever as a
        result of any action or omission by company, provider or any company contactor, including, without limitation,
        any products and services described. Member acknowledges that receiving the services described in this agreement
        may be extremely risky and agrees to hold company harmless for any loss or damages. Company&apos;s maximum
        liability for any type of damages or loss shall be limited to the membership fee paid to company for this
        membership. Notwithstanding the foregoing, it is understood and agreed that company shall have no liability of
        any kind arising from or related to, directly or indirectly, any act or omission of provider or any
        consultation, including any personal information collected in connection with such consultation. company,
        provider or any company contactor, including, without limitation, any products and services described. Member
        acknowledges that receiving the services described in this agreement may be extremely risky and agrees to hold
        company harmless for any loss or damages. Company&apos;s maximum liability for any type of damages or loss shall
        be limited to the membership fee paid to company for this membership. Notwithstanding the foregoing, it is
        understood and agreed that company shall have no liability of any kind arising from or related to, directly or
        indirectly, any act or omission of provider or any consultation, including any personal information collected in
        connection with such consultation.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        6. Indemnity. Member agrees to indemnify, save and hold harmless Company, its affiliates and their respective
        officers, employees, directors, managers, shareholders, agents, legal counsel, accountants and guarantors from
        and against any and all fines, demands, costs, losses, liabilities, damages, lawsuits, actions, deficiencies,
        claims, taxes and expenses (whether or not arising out of third-party claims) including, without limitation,
        interest, penalties, reasonable attorneys&apos; fees and all amounts paid in investigation, defense or
        settlement and expenses (whether or not arising out of third-party claims) including, without limitation,
        interest, penalties, reasonable attorneys&apos; fees and all amounts paid in investigation, defense or
        settlement of any of the foregoing incurred in connection with or arising out of or resulting from Member&apos;s
        actions or the actions of any of such Member&apos;s Designated Representative(s), agents or independent
        contractors. Company shall be subrogated to all of Member&apos;s rights of recovery against any party for loss,
        to the extent of any payment and/or costs made or incurred by Company for services and regardless of whether
        Member is made whole. Member hereby acknowledges the foregoing subrogation rights and agrees to execute such
        further and other documents as Company may reasonably request in order to evidence such subrogation rights,
        whether before or after services are performed. Without limiting the generality of the foregoing Company shall
        be entitled to enforce all rights Member has or otherwise would have had against such party, and/or to recover
        directly from Member from any amounts received and/or due from such party. It is further agreed that all costs
        and expenses incurred by Company in performing the services shall conclusively be deemed to be reasonable.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        7. Force Majeure. Company shall not be liable for failure to provide or delay of services resulting from acts of
        God or other causes beyond Company&apos;s control.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        8. Authorization to Obtain and Use Personal Information. As may be required by applicable law, Member(s) hereby
        authorizes (i) the release to or from Company, any Company Contractor and/or Designated Representative of any
        and all confidential Member information, including but not limited to, financial information and protected
        health information (as may be defined by applicable law, such as medical records, histories, examinations and
        tests, medical images, photographs, x-rays, output data but not limited to, financial information and protected
        health information (as may be defined by applicable law, such as medical records, histories, examinations and
        tests, medical images, photographs, x-rays, output data from medical devices and sound and video files)
        (&quot;Personal Information&quot;), and (ii) Company and Company Contractors to use any and all such Personal
        Information in connection with providing services hereunder, in its sole discretion. The Member agrees to
        provide and to otherwise assist Company in obtaining Personal Information when requested by Company and
        acknowledges and agrees that Company shall not be obligated to provide services if Company is not able to
        receive or release any necessary Personal Information required.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        9. Informed Consent for Transport and Treatment. Member hereby gives informed consent for any transportation and
        medical care of Member by Company and/or Company Contractors contemplated by this Agreement, including
        Consultations. Member has been informed and understands the benefits and risks associated with transport,
        medical care and telemedicine consultation (including potential technology risks, such as interruptions,
        unauthorized access and/or technical difficulties) that may be requested and/or provided under this Agreement
        and hereby consents thereto. the benefits and risks associated with transport, medical care and telemedicine
        consultation (including potential technology risks, such as interruptions, unauthorized access and/or technical
        difficulties) that may be requested and/or provided under this Agreement and hereby consents thereto. Member
        understands and agrees that medical care, including emergency care, may be initiated during transport by Company
        and/or Company Contractors should such care become necessary in the professional judgment of Company and/or
        Company Contractors. Member agrees to read and execute all forms, waivers, releases and other necessary
        documents prior to receiving services under this Agreement, including but not limited to Consultations. Company
        shall not be obligated to provide services of any kind if all requested documents are not read and executed by
        Member.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        10. Designated Representative. Except as provided in Section 2.4 of this Agreement, in the event that a Member
        is unable to make decisions, Company or Company Contractors will attempt to contact the Member&apos;s Designated
        Representative for the purposes of making decisions on behalf of Member in regards to any items or services set
        forth in this Agreement. The Designated Representative is the person or persons identified to Company by the
        Member during enrollment or after as the primary person who will be making decisions on behalf of the Member in
        the event the Member becomes incapacitated. Agreement. The Designated Representative is the person or persons
        identified to Company by the Member during enrollment or after as the primary person who will be making
        decisions on behalf of the Member in the event the Member becomes incapacitated.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        11. Amendment. Company may amend this Agreement without notice to Member which shall be effective immediately
        upon posting on Company&apos;s website.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        12. Enforceability. If any portion or provision of this Agreement shall to any extent be declared illegal or
        unenforceable by a court of competent jurisdiction, then the remainder of this Agreement, or the application of
        such portion or provision in circumstances other than those as to which it is so declared illegal or
        unenforceable, shall not be affected thereby, and each portion and provision of this Agreement shall be valid
        and enforceable to the fullest extent permitted by law. affected thereby, and each portion and provision of this
        Agreement shall be valid and enforceable to the fullest extent permitted by law.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        13. Waiver. No failure or delay in exercising any right, power, or remedy under this Agreement shall operate as
        a waiver of any such right, power or remedy.
      </Text>
    </View>

    <View style={longTextStyles.termsSection}>
      <Text style={longTextStyles.subsectionText}>
        14. Disputes and Arbitration. In the event of a dispute related to this Agreement, the parties agree to the
        following:
      </Text>

      <View style={longTextStyles.listItem}>
        <Text style={longTextStyles.bulletPoint}>a.</Text>
        <Text style={longTextStyles.listItemText}>
          Member and Company agree to submit any claim, dispute, action, cause of action, issue, or request for relief
          arising out of or relating to this Agreement and/or Member&apos;s use of the Services (whether based in
          contract, tort, statute, fraud, misrepresentation or any other legal theory) to binding arbitration rather
          than by filing any lawsuit in any forum other than set forth in this section. Further Member agrees
          arbitration is final and binding and subject to only very limited review by a court. Member also waives the
          right to any form of appeal, review or recourse to any court or other judicial authority, insofar as such
          waiver may be validly made. This provision is intended to be interpreted broadly to encompass all disputes or
          claims arising out of or relating to this Agreement and/or Member&apos;s use of the Services.
        </Text>
      </View>

      <View style={longTextStyles.listItem}>
        <Text style={longTextStyles.bulletPoint}>b.</Text>
        <Text style={longTextStyles.listItemText}>
          Member must first present any claim or dispute to Company by contacting Company to allow an opportunity to
          resolve the dispute through good faith discussions. Member may request arbitration if Member&apos;s claim or
          dispute cannot be resolved within 60 days after presenting the claim or dispute to Company. Company may
          request arbitration against Member at any time after it has notified Member of a claim or dispute. The
          arbitration of any dispute or claim shall be conducted in accordance with the then current and applicable
          rules of JAMS as modified by this Agreement. The place of any arbitration will be Boston, Massachusetts, USA,
          and will be conducted in the English language. Claims will be heard by a single arbitrator. The arbitrator may
          not award relief in excess of or contrary to what this Agreement provides, order consolidation or arbitration
          on a class wide or representative basis, award punitive or consequential damages or any other damages aside
          from the prevailing party&apos;s actual damages, or order injunctive or declaratory relief, except that the
          arbitrator may award on an individual basis damages required by statute and may order injunctive or
          declaratory relief pursuant to an applicable consumer protection statute. Any arbitration shall be
          confidential, and neither Member, nor Company nor the arbitrator may disclose the existence, content or
          results of any arbitration, except as may be required by law or for purposes of enforcement or appeal of the
          arbitration award. Judgment on any arbitration award may be entered in any court having proper jurisdiction.
          If any portion of this arbitration clause is determined by a court to be inapplicable or invalid, then the
          remainder shall still be given full force and effect.
        </Text>
      </View>

      <View style={longTextStyles.listItem}>
        <Text style={longTextStyles.bulletPoint}>c.</Text>
        <Text style={longTextStyles.listItemText}>
          There shall be no right or authority for any claims subject to this arbitration clause to be arbitrated on a
          class action or consolidated basis or on bases involving claims brought in a purported representative capacity
          on behalf of the general public (including, but not limited to, as a private attorney general).
        </Text>
      </View>

      <View style={longTextStyles.listItem}>
        <Text style={longTextStyles.bulletPoint}>d.</Text>
        <Text style={longTextStyles.listItemText}>
          All administrative fees and expenses of arbitration will be divided equally between Member and Company. Each
          party will bear the expense of its own counsel, experts, witnesses and preparation and presentation of
          evidence at the arbitration hearing.
        </Text>
      </View>
      <View style={longTextStyles.listItem}>
        <Text style={longTextStyles.bulletPoint}>e.</Text>
        <Text style={longTextStyles.listItemText}>
          MEMBER MUST CONTACT COMPANY WITHIN ONE (1) MONTH OF THE DATE OF THE OCCURRENCE OF THE EVENT OR FACTS GIVING
          RISE TO A DISPUTE, OR MEMBER WAIVES THE RIGHT TO PURSUE ANY CLAIM BASED UPON SUCH EVENT, FACTS, OR DISPUTE.
        </Text>
      </View>
    </View>

    <Text style={longTextStyles.subsectionText}>
      15. Fraudulent Activity. Any fraud, misrepresentation, omission or concealment in the statements and/or actions
      made by Member in obtaining this membership or requesting services may render Member ineligible to receive
      services from Company, at Company&apos;s sole discretion, including but not limited to, knowingly purchasing a
      Company membership when a medical or security event has already begun or is imminent or when any other membership
      exclusion exists. All items and services shall be forfeited and Company shall be entitled to reimbursement,
      including attorney&apos;s fees, for any services provided based on such statements and/or actions.
    </Text>

    <Text style={longTextStyles.subsectionText}>
      16. Entire Agreement. This Agreement represents the entire agreement between Member and Company and supersedes any
      agreement or representation, written or oral, occurring outside of this Agreement. Company reserves the right to
      change or amend the terms contained in this Agreement without prior notice.
    </Text>
  </>
);

export default MembershipLongText;
