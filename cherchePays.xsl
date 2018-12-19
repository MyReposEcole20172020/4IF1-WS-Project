<?xml version="1.0" encoding="UTF-8"?>

<!-- New document created with EditiX at Wed Mar 14 17:14:07 CET 2018 -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>

	
	<xsl:param name="pays"/>
	<xsl:template match="/">
		<HTML>
		<BODY bgcolor="#FFFFCC">
		<UL><xsl:apply-templates select=".//country[name/common=$pays]"/></UL>
		</BODY>
		</HTML>	
		
	</xsl:template>
	
	
	<xsl:template match="country">
		
		<li>
			Nom officiel : <xsl:value-of select=".//name/official"/> 
		</li>
		<li>
			Capitale : <xsl:value-of select=".//capital"/> 
		</li>
	</xsl:template>

</xsl:stylesheet>